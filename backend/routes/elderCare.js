const express = require('express');
const router = express.Router();
const {
  getRequests,
  createRequest,
  acceptRequest,
  completeRequest,
  getRequest,
  deleteRequest,
  payForRequest,
} = require('../controllers/elderCareController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getRequests);
router.get('/:id', protect, getRequest);
router.post('/', protect, createRequest);
router.post('/:id/pay', protect, payForRequest);
router.put('/:id/accept', protect, authorize('volunteer', 'admin'), acceptRequest);
router.put('/:id/complete', protect, completeRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;