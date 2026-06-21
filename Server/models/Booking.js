import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
  amount: {
    type: Number,
    required: true,
  },
},{
  timestamps: true,
});
export const bookingModel = mongoose.model("Booking", bookingSchema);
