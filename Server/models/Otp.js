import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,  
    },
    email:{
        type:String,
        required:true,

    },
    otp:{
        type:String,
        required:true
    },
    action:{
        type:String,
        enum : ["account_verification","event_booking"],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:300 // OTP expires after 5 minutes
    }
    
},{
    timestamps:true
});
export const otpModel = mongoose.model("Otp",otpSchema);