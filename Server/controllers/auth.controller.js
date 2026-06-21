import { userModel } from "../models/User.js";
import { sendOTPEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import { otpModel } from "../models/Otp.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await otpModel.create({
      userid: newUser._id,
      email,
      otp,
      action: "account_verification",
    });
    await sendOTPEmail(email, otp, "account_verification");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified && user.role === "user") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await otpModel.findOneAndUpdate(
        { email, action: "account_verification" },
        { otp: otp, createdAt: Date.now() },
        { upsert: true }
      );
      await sendOTPEmail(email, otp, "account_verification");
      return res
        .status(400)
        .json({ message: "Account not verified. OTP sent to email." });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Login successful",
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await otpModel.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const user = await userModel.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    await otpModel.deleteMany({
      email,
      action: "account_verification",
    });

    res.status(200).json({
      message: "Account verified successfully",
      token: generateToken(user._id, user.role),
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
