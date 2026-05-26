import express from  "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import events from "./routes/events.js";
import bookings from "./routes/bookings.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
//Routes
app.use("/api/auth",auth);
app.use("/api/events",events);
app.use("/api/bookings",bookings); 



const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})  ;

app.listen(PORT,()=>{
    console.log("Sever is listening");
})