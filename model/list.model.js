import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  rating: {
    type: String,
  },
  tag: {
    type: String,
    default: ''
  },
  image: {
    type: String,
  },
  address: {
    street: { type: String },
    area: { type: String },
    city: { type: String },
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ListModel = mongoose.model('List', listSchema);
export default ListModel;
