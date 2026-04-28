import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { InsertUser } from '../db/schema';
import { JWT_CONFIG, BCRYPT_CONFIG, EMAIL_CONFIG, SERVER_CONFIG } from '../lib/config';
import { AppError } from '../middleware/errorHandler';
import { emailService } from './email.service';

type PublicUser = Omit<InsertUser, 'password' | 'emailVerificationToken' | 'emailVerificationExpiresAt'>;

/**
 * Service for user authentication and authorization
 * Handles registration, login, and JWT token management
 */
export class AuthService {
  /**
   * Registers a new user
   * @param data - User registration data (email, password, name)
   * @returns Promise resolving to user object (without password) and JWT token
   * @throws Error if user already exists
   */
  async register(data: Omit<InsertUser, 'createdAt' | 'emailVerifiedAt' | 'emailVerificationToken' | 'emailVerificationExpiresAt'>): Promise<{ user: PublicUser; message: string }> {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existing.length > 0) {
      throw new AppError('User already exists', 409);
    }

    if (SERVER_CONFIG.IS_PRODUCTION && !emailService.isConfigured()) {
      throw new AppError('Email delivery is not configured', 503);
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_CONFIG.SALT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = hashToken(verificationToken);
    const verificationExpiresAt = new Date(
      Date.now() + EMAIL_CONFIG.VERIFICATION_EXPIRES_HOURS * 60 * 60 * 1000
    ).toISOString();

    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
        emailVerifiedAt: null,
        emailVerificationToken: verificationTokenHash,
        emailVerificationExpiresAt: verificationExpiresAt,
      })
      .returning();

    await emailService.sendVerificationEmail({
      to: newUser.email,
      name: newUser.name,
      verificationUrl: buildVerificationUrl(verificationToken),
    });

    return {
      user: toPublicUser(newUser),
      message: 'Account created. Check your email to confirm your address.',
    };
  }

  /**
   * Authenticates a user and generates JWT token
   * @param email - User email
   * @param password - User password (plain text)
   * @returns Promise resolving to user object (without password) and JWT token
   * @throws Error if credentials are invalid
   */
  async login(email: string, password: string): Promise<{ user: PublicUser, token: string }> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.emailVerifiedAt) {
      throw new AppError('Confirm your email before logging in', 403);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );

    return { user: toPublicUser(user), token };
  }

  async verifyEmail(token: string): Promise<{ user: PublicUser; token: string }> {
    const tokenHash = hashToken(token);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, tokenHash))
      .limit(1);

    if (!user) {
      throw new AppError('Invalid or expired verification link', 400);
    }

    if (
      !user.emailVerificationExpiresAt ||
      Number(new Date(user.emailVerificationExpiresAt)) < Date.now()
    ) {
      throw new AppError('Verification link expired', 400);
    }

    const [updatedUser] = user.emailVerifiedAt
      ? [user]
      : await db
          .update(users)
          .set({
            emailVerifiedAt: new Date().toISOString(),
          })
          .where(eq(users.id, user.id!))
          .returning();

    const jwtToken = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );

    return { user: toPublicUser(updatedUser), token: jwtToken };
  }

  /**
   * Verifies and decodes a JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload with userId and email
   * @throws Error if token is invalid or expired
   */
  verifyToken(token: string): { userId: number; email: string } {
    try {
      return jwt.verify(token, JWT_CONFIG.SECRET) as { userId: number; email: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Retrieves a user by ID without password
   * @param id - User ID
   * @returns Promise resolving to user object or null if not found
   */
  async getUserById(id: number) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return null;
    }

    return toPublicUser(user);
  }
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function buildVerificationUrl(token: string): string {
  const url = new URL('/api/auth/verify-email', SERVER_CONFIG.FRONTEND_URL);
  url.searchParams.set('token', token);
  return url.toString();
}

function toPublicUser(user: InsertUser): PublicUser {
  const {
    password,
    emailVerificationToken,
    emailVerificationExpiresAt,
    ...publicUser
  } = user;

  return publicUser;
}

export const authService = new AuthService();
