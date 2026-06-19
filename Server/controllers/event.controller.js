import { eventModel } from "../models/Event.js";

export const getAllEvents = async (req,res) => {
    try {
        const filters = {};
        
        if (req.query.category) {
            filters.category = req.query.category;
        }   
        if(req.query.location) {
            filters.location = req.query.location;
        }
        const events = await eventModel.find(filters);

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
export const getEventById = async (req,res) => {
       try{
        const event = await eventModel.findById(req.params.id);
        if(!event){
            return res.status(404).json({message:"Event not found"});
        }
        res.json(event);
       }
       catch(error){
        res.status(500).json({ message: "Server error" });
       }

}

export const createEvent = async (req,res)=>{
    try{
        const {title,description,date,location,category,totalSeats,availableSeats,price,imageUrl} = req.body;
        const event = new eventModel({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            price,
            imageUrl,
            createdBy: req.user._id
        });
        await event.save();
        res.status(201).json(event);
    }
    catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

export const updateEvent = async (req,res) => {
    try{
        const {title,description,date,location,category,totalSeats,availableSeats,price,imageUrl} = req.body;
        const event = await eventModel.findByIdAndUpdate(req.params.id,
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            price,
            imageUrl
        );
        if(!event){
            return res.status(404).json({message:"Event not found"});
        }
        res.json(event);
    }
    catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteEvent = async (req,res) => {
    try{
        const event = await eventModel.findByIdAndDelete(req.params.id);
        if(!event){
            return res.status(404).json({message:"Event not found"});
        }
        res.json({message:"Event deleted successfully"});
    }
    catch(error){
        res.status(500).json({ message: "Server error" });
    }
}