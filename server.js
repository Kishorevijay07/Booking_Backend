import express from 'express';
import dotenv from 'dotenv';
import connectdb from './db/connectdb.js';
import authfunctions from './routes/auth.route.js';
import listingsfunctions from './routes/listing.route.js';
import bookingfunction from "./routes/Booking.route.js";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from "cors";


const app = express();
dotenv.config();
app.use(express.json(
    {
        limit : "7mb"
    }
))
app.use(cors({
  origin:"https://booking-frontend-ashen.vercel.app",
  credentials:true
}))

app.use(cookieParser());
cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret:process.env.api_secret 
    });
    
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/auth',authfunctions);
app.use("/listings",listingsfunctions);
app.use("/booking",bookingfunction)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
    connectdb()
        .then(() => console.log('Database connected successfully'))
        .catch((error) => console.error('Database connection failed:', error));
});