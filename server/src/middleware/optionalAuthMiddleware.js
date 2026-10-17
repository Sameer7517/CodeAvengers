import { verifyToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';
import { inMemoryUserStore } from '../services/inMemoryUserStore.js';

export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return next();
  }

  try {
    let user = null;
    if (isDatabaseConnected()) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = inMemoryUserStore.findById(decoded.id);
    }

    if (user) {
      req.user = user;
    }
  } catch (err) {
    // silently continue without attaching user
  }

  next();
};
