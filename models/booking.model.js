const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    eventID:{
        type:Schema.Types.ObjectId,
        ref:'Event'
    },
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = {Booking}