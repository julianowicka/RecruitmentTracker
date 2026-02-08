import { Router } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../middleware/errorHandler';
import { authLimiter } from '../middleware/rateLimit';
import { AUTH_CONFIG } from '../lib/config';

export const authRouter = Router();

// Apply strict rate limiting to auth routes
authRouter.use(authLimiter);

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
      res.status(400).json({ error: `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters` });
      return;
    }

    const result = await authService.register({ email, password, name });
    res.status(201).json(result);
  })
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await authService.login(email, password);
    res.json(result);
  })
);

authRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    const user = await authService.getUserById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  })
);

