import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: Date, checkOut: Date,
  totalAmount: Number,
  paymentStatus: { type: String, enum: ['paid','pending','failed'], default: 'paid' },
  stripeSessionId: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Booking', bookingSchema);