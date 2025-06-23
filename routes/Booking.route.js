import express from "express";
import { createBooking, getUserBookings } from "../controllers/booking.controller.js";
import protectroute from "../middleware/protectroute.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/",authenticate,createBooking)
router.get("/",authenticate,getUserBookings);

export default router;