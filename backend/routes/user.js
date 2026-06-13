import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('flights');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.tel = req.body.tel || user.tel;
      
      // Update role-specific fields
      if (user.type === 'Company') {
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.location = req.body.location !== undefined ? req.body.location : user.location;
        user.username = req.body.username !== undefined ? req.body.username : user.username;
        user.logoImg = req.body.logoImg !== undefined ? req.body.logoImg : user.logoImg;
      } else {
        user.photo = req.body.photo !== undefined ? req.body.photo : user.photo;
        user.passportImg = req.body.passportImg !== undefined ? req.body.passportImg : user.passportImg;
        user.accountBalance = req.body.accountBalance !== undefined ? req.body.accountBalance : user.accountBalance;
      }

      if (req.body.password) {
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.default.genSalt(10);
        user.password = await bcrypt.default.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/companies
// @desc    Get all companies
router.get('/companies', protect, async (req, res) => {
  try {
    const companies = await User.find({ type: 'Company' }).select('-password');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
