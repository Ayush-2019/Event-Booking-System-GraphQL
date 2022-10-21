import React from "react";

const BookControls = props => {

    return(
        <div className="book_controls">
            <button className={props.isActive === 'list' ? 'active' : ''} onClick={props.typeHandler.bind(this, 'list')}>Bookings</button>
            <button className={props.isActive === 'chart' ? 'active' : ''} onClick={props.typeHandler.bind(this, 'chart')}>Chart</button>
        </div>
    )
}

export default BookControls;