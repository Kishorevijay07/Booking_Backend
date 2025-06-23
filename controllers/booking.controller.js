import Booking from "../model/booking.model.js";
import ListModel from "../model/list.model.js";
import stripe from "stripe";
// Stripe Secret Key from .env

// 1️⃣ CREATE BOOKING - with Stripe session
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const userId = req.user.userid;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const room = await ListModel.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const days = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return res.status(400).json({ error: "Invalid date range" });

    const totalAmount = days * parseInt(room.price);

    // Create Stripe Checkout Session


    // Save Booking with pending status
    const newBooking = new Booking({
      roomId,
      userId,
      checkIn,
      checkOut,
      totalAmount,

    });

    await newBooking.save();

    res.status(200).json({newBooking});
  } catch (err) {
    console.error("Create Booking Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2️⃣ HANDLE STRIPE WEBHOOK (when payment is confirmed)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const booking = await Booking.findOne({ stripeSessionId: session.id });
    if (booking) {
      booking.paymentStatus = "paid";
      await booking.save();
    }
  }

  res.json({ received: true });
};

// 3️⃣ GET BOOKINGS FOR USER
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userid;

    const bookings = await Booking.find({ userId })
      .populate("roomId", "title image address price")
      .sort({ createdAt: -1 });

    // Optional: reshape the response
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      room: {
        _id: booking.roomId?._id,
        title: booking.roomId?.title,
        image: booking.roomId?.image,
        address: booking.roomId?.address,
        price: booking.roomId?.price,
      }
    }));

    res.status(200).json(formattedBookings);
  } catch (err) {
    console.error("Fetch Bookings Error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

