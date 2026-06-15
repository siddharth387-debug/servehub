const mongoose = require('mongoose');

const elderCareSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beneficiaryName: { type: String, required: true },
  beneficiaryAge: { type: Number, required: true },
  serviceType: {
    type: String,
    enum: ['gardening', 'food-delivery', 'medical-assistance', 'companionship', 'household-help', 'transportation', 'grocery', 'medication-reminder', 'other'],
    required: true
  },
  description: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    pincode: String
  },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  frequency: {
    type: String,
    enum: ['one-time', 'daily', 'weekly', 'monthly'],
    default: 'one-time'
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  budget: { type: Number, default: 0, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'paid'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String },
  contactPhone: { type: String }
}, { timestamps: true });

elderCareSchema.methods.isPaymentRequired = function () {
  return this.budget > 0;
};

elderCareSchema.methods.isVisibleToVolunteers = function () {
  if (!this.isPaymentRequired()) return true;
  return this.paymentStatus === 'paid';
};

module.exports = mongoose.model('ElderCare', elderCareSchema);
