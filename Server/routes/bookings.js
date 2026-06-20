import express from "express";
const router = express.Router();
import { protect, admin } from "../middlewares/auth.middleware.js";
import { bookEvent, getMyBookings, cancelBooking, confirmBooking, sendBookingOTP,getAllBookings } from "../controllers/booking.controller.js"; // ✅ added sendBookingOTP

router.post("/book/:eventId", protect, bookEvent);
router.post("/send-otp", protect, sendBookingOTP); // ✅ fixed
router.get("/my-bookings", protect, getMyBookings);
router.put("/:id/confirm", protect, admin, confirmBooking);
router.get("/all", protect, admin, getAllBookings); 
router.delete("/:id", protect, cancelBooking);

export default router;