const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({

    guestName: {
        type:String,
        required:true
    },

    email: {
        type:String,
        required:true
    },

    roomNumber: {
        type:String,
        required:true
    },

    checkIn: {
        type:Date,
        required:true
    },


    checkOut: {
        type:Date,
        required:true
    },


    guests: {
        type:Number,
        required:true
    },


    totalPrice: {
        type:Number,
        required:true
    },


    status: {
        type:String,
        required:true,
        default:"Pending"
    },

});

module.exports = mongoose.model("Booking", bookingSchema)