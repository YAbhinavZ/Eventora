import express from "express";
const router = express.Router();
import { protect, admin } from "../middlewares/auth.middleware.js";
import { bookEvent, getMyBookings, cancelBooking, confirmBooking, sendBookingOTP,getAllBookings } from "../controllers/booking.controller.js"; // ✅ added sendBookingOTP

// Specific routes first
router.post("/send-otp", protect, sendBookingOTP);
router.get("/my-bookings", protect, getMyBookings);
router.get("/all", protect, admin, getAllBookings);  // 👈 move before /:id routes

// Dynamic /:id routes last
router.post("/book/:eventId", protect, bookEvent);
router.put("/:id/confirm", protect, admin, confirmBooking);
router.delete("/:id", protect, cancelBooking);

export default router;