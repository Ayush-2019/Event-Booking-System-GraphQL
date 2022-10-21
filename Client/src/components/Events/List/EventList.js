import React from "react";
import EventItem from "./items";

const EventList = props => {

    const events = props.events.map((event,id) => {
        return ( 
            <React.Fragment>
        <EventItem
            key = {event._id}
            id = {event._id}
            event = {event}
            userID = {props.authuser}
            createrID = {event.creater._id}
            details = {props.onShow}

        />
        
        
        </React.Fragment>)
    })

    return(<ul className="all_events">
                {events}
            </ul>)
};

export default EventList;