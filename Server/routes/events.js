import express from "express";
const router = express.Router();
import {protect,admin} from "../middlewares/auth.middleware.js";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller.js";

router.get("/",getAllEvents);
router.get("/:id",getEventById);
router.post("/",protect,admin,createEvent);
router.put("/:id",protect,admin,updateEvent);
router.delete("/:id",protect,admin,deleteEvent);
export default router;