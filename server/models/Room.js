const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

    roomNumber:{
        type: Number,
        required: true
    },

    roomType:{
        type: String,
        required: true
    },

    price:{
        type: Number,
        required: true
    },

    capacity: {
        type: Number,
        required:true
    },

    description:{
        type: String,
        required:true
    },

    image:{
        type: String,
        required:true
    },

    facilities:{
        type:[String],
        required: true
    },

    available:{
        type:Boolean,
        default:true
    }

});

module.exports = mongoose.model("Room", roomSchema);