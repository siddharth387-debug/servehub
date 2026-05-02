const express = require('express');
const router = express.Router();
const { getCareers, getCareer, createCareer, applyCareer, updateCareer, deleteCareer } = require('../controllers/careerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCareers);
router.get('/:id', getCareer);
router.post('/', protect, authorize('provider', 'admin'), createCareer);
router.post('/:id/apply', protect, applyCareer);
router.put('/:id', protect, authorize('provider', 'admin'), updateCareer);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteCareer);

module.exports = router;
