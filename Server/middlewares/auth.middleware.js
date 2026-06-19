import jwt from "jsonwebtoken";
import {userModel} from "../models/User.js";

export const protect= async (req,res,next)=>{
    let token  = req.headers.authorization && req.headers.authorization.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null;
    if(!token){
        return res.status(401).json({message:"Not authorized, no token"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded); // 👈 add this
        const user = await userModel.findById(decoded.id).select("-password");
        console.log("Found user:", user);     // 👈 and this
        if(!user){
            return res.status(401).json({message:"Not authorized, user not found"});
        }
        req.user = user; 
        next();
    } catch (error) {
        res.status(401).json({message:"Not authorized, token failed"});
    }

}
export const admin = (req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        res.status(403).json({message:"Not authorized as admin"});
    }
}