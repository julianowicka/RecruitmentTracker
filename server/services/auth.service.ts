import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { InsertUser } from '../db/schema';
import { JWT_CONFIG, BCRYPT_CONFIG } from '../lib/config';

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
  async register(data: Omit<InsertUser, 'createdAt'>): Promise<{ user: Omit<InsertUser, 'password'>, token: string }> {
    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existing.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_CONFIG.SALT_ROUNDS);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning();

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }

  /**
   * Authenticates a user and generates JWT token
   * @param email - User email
   * @param password - User password (plain text)
   * @returns Promise resolving to user object (without password) and JWT token
   * @throws Error if credentials are invalid
   */
  async login(email: string, password: string): Promise<{ user: Omit<InsertUser, 'password'>, token: string }> {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
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

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();

