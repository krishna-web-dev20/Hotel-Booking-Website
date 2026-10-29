const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Room = require("./models/Room");
const Booking = require("./models/Booking");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

    
app.get("/", (req, res) =>{
    res.send("Hotel Booking Server is running!");
});



app.post("/bookings", async (req, res) => {
    try {
        const booking = new Booking(req.body);

        const savedBooking = await booking.save();

        res.status(201).json(savedBooking);

    } catch (error) {
        res.status(500).json({
            message: "Booking creation failed",
            error: error.message
        });
    }
});


app.get("/bookings", async (req,res) => {
    try{
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error){
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
});


app.get("/bookings/:id", async (req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching booking",
            error: error.message
        });
    }
});


app.put("/bookings/:id", async (req,res) => {
    try{
        const updateBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!updateBooking){
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking updated successfully",
            booking: updateBooking
        });

    } catch (error){
        res.status(500).json({
            message: "Booking update failed",
            error: error.message
        });
    }

});



 // DELETE Booking API
app.delete("/bookings/:id", async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(
            req.params.id
        );

        if (!deletedBooking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking deleted successfully",
            booking: deletedBooking
        });

    } catch (error) {
        res.status(500).json({
            message: "Booking deletion failed",
            error: error.message
        });
    }
});



// Add Room
app.post("/rooms", async (req, res) => {
    try {
        const room = new Room(req.body);

        const savedRoom = await room.save();

        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(500).json({
            message: "Error adding room",
            error: error.message
        });
    }
});


// Get All Rooms
app.get("/rooms", async (req, res) => {
    try {
        const rooms = await Room.find();

        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching rooms",
            error: error.message
        });
    }
});


// Get Single Room
app.get("/rooms/:id", async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json(room);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching room",
            error: error.message
        });
    }
});


// Update Room
app.put("/rooms/:id", async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json(updatedRoom);

    } catch (error) {
        res.status(500).json({
            message: "Error updating room",
            error: error.message
        });
    }
});


// Delete Room
app.delete("/rooms/:id", async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);

        if (!deletedRoom) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json({
            message: "Room deleted successfully",
            room: deletedRoom
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting room",
            error: error.message
        });
    }
});


const port = 5000;

app.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`);
});