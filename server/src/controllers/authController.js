import bcrypt from 'bcryptjs';
import { User, checkCollegeDomain } from '../models/User.js';
import { generateToken } from '../utils/token.js';
import { isDatabaseConnected } from '../config/db.js';
import { inMemoryUserStore } from '../services/inMemoryUserStore.js';

/**
 * Register a new student account
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, department, year, campus } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    if (isDatabaseConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'A student account with this email address already exists'
        });
      }

      // Check collegiate verification status based on institutional domain
      const isVerified = checkCollegeDomain(normalizedEmail);

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        department: department || 'General Studies',
        year: year || 'Junior (3rd Year)',
        campus: campus || 'Main Campus',
        isCollegeVerified: isVerified,
        verificationStatus: isVerified ? 'verified' : 'unverified',
        verificationMethod: isVerified ? 'institutional_email' : 'none',
        verifiedAt: isVerified ? new Date() : null,
        badges: isVerified
          ? [{ title: 'Verified Student', icon: 'ShieldCheck', desc: 'Confirmed .edu institutional address' }]
          : []
      });

      const token = generateToken(user._id, { email: user.email, isCollegeVerified: user.isCollegeVerified });

      return res.status(201).json({
        success: true,
        message: isVerified
          ? 'Registration successful! Institutional college email verified.'
          : 'Registration successful! Note: Personal email accounts remain unverified until campus confirmation.',
        token,
        user: user.toJSON()
      });
    } else {
      // In-Memory Fallback
      const existing = inMemoryUserStore.findByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'A student account with this email address already exists'
        });
      }

      const user = await inMemoryUserStore.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        department,
        year,
        campus
      });

      const token = generateToken(user._id, { email: user.email, isCollegeVerified: user.isCollegeVerified });

      return res.status(201).json({
        success: true,
        message: user.isCollegeVerified
          ? 'Registration successful! Institutional college email verified.'
          : 'Registration successful! Note: Personal email accounts remain unverified until campus confirmation.',
        token,
        user
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A student account with this email address already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

/**
 * Login existing student
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDatabaseConnected()) {
      // Must explicitly select password because select: false on schema
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id, { email: user.email, isCollegeVerified: user.isCollegeVerified });

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: user.toJSON()
      });
    } else {
      // In-Memory Fallback
      const userRecord = inMemoryUserStore.findByIdWithPassword(normalizedEmail) ||
                         inMemoryUserStore.findByEmail(normalizedEmail);

      if (!userRecord) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, userRecord.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const { password: pw, ...safeUser } = userRecord;
      const token = generateToken(safeUser._id, { email: safeUser.email, isCollegeVerified: safeUser.isCollegeVerified });

      return res.json({
        success: true,
        message: `Welcome back, ${safeUser.name}!`,
        token,
        user: safeUser
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getProfile = async (req, res) => {
  try {
    // req.user is set by protect middleware
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile',
      error: error.message
    });
  }
};

/**
 * Update authenticated user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, department, year, campus, avatar } = req.body;
    const userId = req.user._id || req.user.id;

    if (isDatabaseConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name.trim();
      if (department) user.department = department;
      if (year) user.year = year;
      if (campus) user.campus = campus;
      if (avatar) user.avatar = avatar;

      await user.save();
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user.toJSON()
      });
    } else {
      const updated = inMemoryUserStore.update(userId, { name, department, year, campus, avatar });
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

/**
 * Verify college status with campus credentials/code
 * POST /api/auth/verify-college
 */
export const verifyCollege = async (req, res) => {
  try {
    const { studentIdCode, collegeEmail } = req.body;
    const userId = req.user._id || req.user.id;

    const emailToTest = collegeEmail || req.user.email;
    const isValidDomain = checkCollegeDomain(emailToTest);
    const isValidCode = studentIdCode && studentIdCode.trim().length >= 4;

    if (!isValidDomain && !isValidCode) {
      return res.status(400).json({
        success: false,
        message: 'Verification failed: Please provide a valid institutional .edu email or valid student ID code.'
      });
    }

    if (isDatabaseConnected()) {
      const user = await User.findById(userId);
      user.isCollegeVerified = true;
      user.verificationStatus = 'verified';
      user.verificationMethod = isValidDomain ? 'institutional_email' : 'student_id_code';
      user.verifiedAt = new Date();
      if (collegeEmail && isValidDomain) {
        user.email = collegeEmail.toLowerCase().trim();
      }
      await user.save();

      res.json({
        success: true,
        message: 'Congratulations! Your campus student status has been successfully verified.',
        data: user.toJSON()
      });
    } else {
      const updated = inMemoryUserStore.update(userId, {
        isCollegeVerified: true,
        verificationStatus: 'verified',
        verificationMethod: isValidDomain ? 'institutional_email' : 'student_id_code',
        verifiedAt: new Date()
      });

      res.json({
        success: true,
        message: 'Congratulations! Your campus student status has been successfully verified.',
        data: updated
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during college verification',
      error: error.message
    });
  }
};

/**
 * Logout
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully. JWT cleared from client.'
  });
};
