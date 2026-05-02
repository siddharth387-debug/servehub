// routes/users.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer', isActive: true }).select('-password');
    res.json({ success: true, volunteers });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
