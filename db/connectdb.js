// db/connectdb.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectdb = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('MONGO_URI not set in .env file');
  }

  await mongoose.connect(mongoURI);
};

export default connectdb;
