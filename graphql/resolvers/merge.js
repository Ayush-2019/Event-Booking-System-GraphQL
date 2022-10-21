const {Event} = require('../../models/event');
const {User} = require('../../models/user.model');
const {dateToString} = require('../../helpers/date');
const DataLoader = require('dataloader');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
})

const userLoader = new DataLoader(userIds => {
    return User.find({_id:{$in:userIds}});
})

const transformEvents = event => {
    return {
        ...event._doc, 
        _id:event.id, 
        date:dateToString(event._doc.date),
        creater:user.bind(this, event.creater)
    }
};

const transformBookings = booking => {
    return{
        ...booking._doc, 
        _id:booking.id, 
        user:user.bind(this, booking._doc.userID),
        event:bookedEvent.bind(this, booking._doc.eventID),
        createdAt:dateToString(booking._doc.createdAt),
        updatedAt:dateToString(booking._doc.updatedAt)
    }
}

const events = async eventids => {
    try{
    const events = await Event.find({_id:{$in:eventids}});
    events.sort((a,b) => {
        return (
            eventids.indexOf(a._id.toString()) - eventids.indexOf(b._id.toString())
        );
    });
        return events.map(event => {
            return transformEvents(event);
        });
} catch(err){
    throw err;
}
}

const bookedEvent = async eventID => {
    try{
        const event = await eventLoader.load(eventID.toString());

        return event;
    }catch(err){
        throw err;
    }
}

const user = async userid => {
    try{
    const user = await userLoader.load(userid.toString())
        return {
            ...user._doc, 
            _id:user.id, 
            createEvents:() => eventLoader.loadMany(user._doc.createEvents)
        }
    } catch(err){
        throw err;
    }
}

exports.user = user;
exports.events = events;
exports.bookedEvent = bookedEvent;