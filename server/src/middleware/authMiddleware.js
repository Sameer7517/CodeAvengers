import { verifyToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';
import { inMemoryUserStore } from '../services/inMemoryUserStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Access token missing. Please sign in.'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Token is invalid or expired. Please sign in again.'
    });
  }

  try {
    let user = null;

    if (isDatabaseConnected()) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = inMemoryUserStore.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Student account not found.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error occurred',
      error: error.message
    });
  }
};
