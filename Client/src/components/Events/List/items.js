import React from "react";

const EventItem = props => (
    <li key={props.id} className="event_item">
        <div>
            <div className="event_fields"><span>Event:- </span>{props.event.title}</div>
            <div className="event_fields"><span>Price:- </span>${props.event.price}</div>
            <div className="event_fields"><span>Date and Time:- </span>{new Date(props.event.date).toLocaleString()}</div>
            <div className="event_fields"><span>Description:-  </span>{props.event.description}</div>
            {props.userID === props.createrID ?<p className="owner_tag">You created this event</p> : null}
        </div>


        <div>
            {props.userID !== props.createrID ? <button className="btn" onClick={props.details.bind(this, props.event._id)}>View Details</button>:
            null}
        </div>
        </li>
)

export default EventItem; 