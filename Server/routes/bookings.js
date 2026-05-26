import express from "express";
const router = express.Router();
import {protect,admin} from "../middlewares/auth.middleware.js";
import { bookEvent, getMyBookings, cancelBooking,confirmBooking } from "../controllers/booking.controller.js";
import { sendOTPEmail } from "../utils/email.js";
router.post("/book/:eventId",protect,bookEvent);
router.post("/send-otp",protect,sendOTPEmail);
router.get("/my-bookings",protect,getMyBookings);
router.put("/:id/confirm",protect,admin, confirmBooking);
router.delete("/:id",protect,cancelBooking);

export default router;