import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { companyId, passengerId, content } = req.body;
    
    const message = await Message.create({
      companyId,
      passengerId,
      senderId: req.user.id,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/messages/:otherUserId
// @desc    Get messages between current user and another user
router.get('/:otherUserId', protect, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.otherUserId;

    let filter = {};
    if (req.user.type === 'Company') {
      filter = { companyId: currentUserId, passengerId: otherUserId };
    } else {
      filter = { companyId: otherUserId, passengerId: currentUserId };
    }

    const messages = await Message.find(filter).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/messages/contacts/list
// @desc    Get list of unique contacts for messaging
router.get('/contacts/list', protect, async (req, res) => {
  try {
    let contacts = [];
    if (req.user.type === 'Company') {
      const messages = await Message.find({ companyId: req.user.id }).populate('passengerId', 'name photo');
      const uniqueIds = new Set();
      contacts = messages.map(m => m.passengerId).filter(p => {
        if(!p) return false;
        if(uniqueIds.has(p._id.toString())) return false;
        uniqueIds.add(p._id.toString());
        return true;
      });
    } else {
      const messages = await Message.find({ passengerId: req.user.id }).populate('companyId', 'name logoImg');
      const uniqueIds = new Set();
      contacts = messages.map(m => m.companyId).filter(c => {
        if(!c) return false;
        if(uniqueIds.has(c._id.toString())) return false;
        uniqueIds.add(c._id.toString());
        return true;
      });
    }
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
