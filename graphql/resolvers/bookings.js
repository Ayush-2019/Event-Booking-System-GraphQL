const {Booking} = require('../../models/booking.model');
const {dateToString} = require('../../helpers/date');
const {bookedEvent, user} = require('./merge');
const {Event} = require('../../models/event');


const transformBookings = booking => {
    return{
        ...booking._doc, 
        _id:booking.id, 
        user:user.bind(this, booking._doc.userID),
        event:bookedEvent.bind(this, booking._doc.eventID),
        createdAt:dateToString(booking._doc.createdAt),
        updatedAt:dateToString(booking._doc.updatedAt)
    }
};

const transformEvents = event => {
    return {
        ...event._doc, 
        _id:event.id, 
        date:dateToString(event._doc.date),
        creater:user.bind(this, event.creater)
    }
};


module.exports = {
    
    bookings: async(args, req) => {
        if(!req.isAuth){
            throw new Error('Not Authorized')
        }
        try{
            const bookings = await Booking.find({userID:req.userID});

            return bookings.map(booking => {
                return transformBookings(booking);

            })
        }catch(err){
            throw err
        }
    },
    
    bookEvent: async (args, req) => {

        if(!req.isAuth){
            throw new Error('Not Authorized')
        }

        const eventBooked = await Event.findOne({_id:args.eventID});

        const booking = new Booking({
            userID:req.userID,
            eventID: eventBooked
        });

        const res = await booking.save();

        return transformBookings(res);
    },
    cancelBooking : async (args, req) => {

        if(!req.isAuth){
            throw new Error('Not Authorized')
        }
        try{
            const booking = await Booking.findById(args.bookingID).populate('eventID');
            const event = transformEvents(booking.eventID);
            
            await Booking.deleteOne({_id:args.bookingID})
            return event;

        }catch(err){
            throw err;
        }
    }
}