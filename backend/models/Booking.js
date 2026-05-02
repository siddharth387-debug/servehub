const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, required: true },
  serviceRef: { type: mongoose.Schema.Types.ObjectId, refPath: 'serviceModel' },
  serviceModel: { type: String, enum: ['Career', 'ElderCare'] },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: { type: Date },
  notes: { type: String },
  totalAmount: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
