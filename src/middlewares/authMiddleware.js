import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.',
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is inactive.',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

// Middleware to check if user is an official
export const isOfficial = (req, res, next) => {
  if (req.user && req.user.role === 'official') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Official role required.',
    });
  }
};

// Middleware to check if user is a citizen
export const isCitizen = (req, res, next) => {
  if (req.user && req.user.role === 'citizen') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Citizen role required.',
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalid, but continue without user
        req.user = null;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

