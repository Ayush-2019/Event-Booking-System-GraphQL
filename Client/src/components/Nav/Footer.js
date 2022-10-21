import React from "react";

const Footer = () =>{

    return(

        <footer className="bck_dark">
                        <div className="font_cursive">
                    Event Booking System
                </div>

                <div className="font_disclaimer">Dream Events {new Date().getFullYear()} all rights reserved</div>
        </footer>
    )
}

export default Footer;