// routes/services.js - General services overview
const express = require('express');
const router = express.Router();
const Career = require('../models/Career');
const ElderCare = require('../models/ElderCare');

router.get('/overview', async (req, res) => {
  try {
    const [totalJobs, totalCareRequests, completedCare] = await Promise.all([
      Career.countDocuments({ isActive: true }),
      ElderCare.countDocuments(),
      ElderCare.countDocuments({ status: 'completed' })
    ]);
    res.json({ success: true, overview: { totalJobs, totalCareRequests, completedCare } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
