import React from "react";

const Modal = props => (
    <div className="modal">
        <header className="modal_header"><h1>{props.title}</h1></header>
        <section className="modal_content">
            {props.children}
        </section>
        <section className="modal_actions">
           {props.cancel && <button className="btn" onClick={props.onClose}>Cancel</button>}
            {props.confirm && <button className={props.cannotSubmit ? '' : 'btn'} onClick={props.onSubmit} disabled = {props.cannotSubmit}>{props.submit}</button>}
        </section>
        {props.shouldLogin && props.cannotSubmit ?  <p style={{marginLeft:'25%', color:'red'}}>Note: You need to login to Book an Event</p> : null}
    </div>
);

export default Modal;