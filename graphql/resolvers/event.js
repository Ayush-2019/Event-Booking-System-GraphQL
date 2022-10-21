const {dateToString} = require('../../helpers/date');
const {Event} = require('../../models/event');
const {User} = require('../../models/user.model');
const {user} = require('./merge');

const transformEvents = event => {
    return {
        ...event._doc, 
        _id:event.id, 
        date:dateToString(event._doc.date),
        creater:user.bind(this, event.creater)
    }
};


module.exports = {
    events: async () => {
        try{
        const events = await Event.find()
            return events.map(event => {
                return transformEvents(event)
        })
        } catch(err){
            throw err;
        }

    },
    createEvents:async (args, req) => {

        if(!req.isAuth){
            throw new Error('Not Authorized')
        }

        const event = new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date:dateToString(args.eventInput.date),
            creater:req.userID
        });

        let createEvents;
        try{
        const result = await event.save()
            createEvents = transformEvents(result);
            const creatinguser = await User.findById(req.userID)
            
            
            if(!creatinguser){
                throw new Error('User not found')
            }
            creatinguser.createEvents.push(event);
            const saved_user =  creatinguser.save();

            return createEvents
        }catch(err) {
            console.log(err);
            throw err;

        };
        
    },
    
    
    
}