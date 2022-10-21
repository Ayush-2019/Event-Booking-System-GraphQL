import { color } from "@mui/system";
import React, { useState } from "react";
import Modal from "../../Modal/modal";
import { ShowToast } from "../Toasts/Toasts";

const BookList = (props) => {

    const [cancelId, setCancelId] = useState(null);

    const handleCancel = async() => {
        await props.cancelBooking(cancelId);
        
        setCancelId(null);
    }

    const handleClose = () => {
        setCancelId(null)
    }
return(

   <>
   {
    cancelId ? 
    
        <Modal
            title = "Are you Sure?"
            submit = "Cancel This Booking"
            onSubmit = {handleCancel}
            confirm = {true}
            cancel = {true}
            onClose = {handleClose}
        >
           The Event Will be cancelled
        </Modal>

        :
        null
   }
    <ul className="booking_ul">

        {
        props.bookings.length === 0 ? 

            <div style={{
                fontFamily:'cursive',
                fontSize:'30px',
                color:'red'
            }}>You Haven't done Any Bookings yet. Please go to Events To Book An Event.</div> : null}
        {props.bookings.map(booking => (
            <li key = {booking._id} className = "booking_item">
                <div className="booking_data">
                    <div>{booking.event.title} <span>ON</span></div>
                    <div>{new Date(booking.createdAt).toLocaleString()}</div>
                </div>
                <div className="booking_actions">
                    <button className="btn" onClick={() => setCancelId(booking._id)}>Cancel This Booking</button> 
                </div>
                </li>
        ))
    }
        
    </ul>
    </>
);
        }

export default BookList;