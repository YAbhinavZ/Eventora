import express from "express";
const router = express.Router();
import { register, login, verifyOTP } from "../controllers/auth.controller.js";

router.post("/register",register);
router.post("/login",login);
router.post("/verify-otp",verifyOTP);

export default router;