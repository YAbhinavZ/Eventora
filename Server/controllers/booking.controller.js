import {eventModel} from "../models/Event.js";
import {bookingModel} from "../models/Booking.js";
import {userModel} from "../models/User.js";
import {otpModel} from "../models/Otp.js";
import { sendOTPEmail, sendBookingEmail } from "../utils/email.js";
import { protect } from "../middlewares/auth.middleware.js";

const genereateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendBookingOTP = async (req, res) => {
  const otp = genereateOTP();
  await OTP.findOneAndDelete({
    userId: req.user._id,
    type: "event_verification",
  });
  await otpModel.create({ userId: req.user._id, otp, action: "event_verification" });
  await sendOTPEmail(req.user.email, otp);
  res.json({ message: "OTP sent to email" });
};

export const bookEvent = async (req, res) => {
  const { eventId, otp } = req.body;
  const otpRecord = await OTP.findOne({
    userId: req.user._id,
    otp,
    action: "event_verification",
  });
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  } 
  if (event.availableSeats <= 0) {      
    return res.status(400).json({ message: "No seats available" });
  }
  const existingBooking = await bookingModel.findOne({ user: req.user._id, event: eventId });
  if (existingBooking) {
    return res.status(400).json({ message: "You have already booked this event" });
  }
  const booking = await new bookingModel({ 
    user: req.user._id, eventId ,
    status : "pending",
    paymentStatus : "unpaid",
    amount : event.price

  }).save();

  await OTP.deleteMany({ userId: req.user._id, action: "event_verification" });
  res.status(201).json({ message: "Booking created, please proceed to payment", bookingId: booking._id });
}

export const confirmBooking = async (req, res) => {
   const {paymentStatus} = req.body.paymentStatus;
   if(paymentStatus !== "paid" && paymentStatus !== "unpaid"){
    return res.status(400).json({message : "Invalid payment status"});
   }
   const booking = await Booking.findById(req.params.bookingId).populate("event");
   if(!booking){    
    return res.status(404).json({message : "Booking not found"});
   }
   if(booking.status==="confirmed"){
    return res.status(400).json({message : "Booking already confirmed"});
   }
   const event = await Event.findById(booking.eventId);
   if(event.availableSeats <= 0){
    return res.status(400).json({message : "No seats available"});
   }
    booking.status = "confirmed";
     if(paymentStatus){
        booking.paymentStatus = paymentStatus;
        event.availableSeats -= 1;
        await event.save();
        await booking.save();
        await sendBookingEmail(booking.userId.email, booking.userId.name, booking.eventId.title);
        res.json({message : "Booking confirmed"});
     }
}

export const getMyBookings = async (req, res) => {
    const bookings = await bookingModel.find({ user: req.user._id }).populate("event");
    res.json(bookings);
}

export const cancelBooking = async (req, res) => {  
    const booking = await Booking.findById(req.params.bookingId);
    if(!booking){    
     return res.status(404).json({message : "Booking not found"});
    }
    if(booking.userId.toString() !== req.user._id.toString()){
     return res.status(403).json({message : "Not authorized to cancel this booking"});
    }
    if(booking.status==="cancelled"){
     return res.status(400).json({message : "Booking already cancelled"});
    }
    
  if(booking.status==="confirmed"){
    const event = await Event.findById(booking.eventId);
    event.availableSeats += 1;
    await event.save();
  }
    booking.status = "cancelled";
    await booking.remove();
    

    res.json({message : "Booking cancelled"});
}

