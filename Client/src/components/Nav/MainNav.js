import { border, color } from "@mui/system";
import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth-context";

const MainNav = (props) => (
     <AuthContext.Consumer>
        {(context) => {
            return(
                <header className="main_nav">
                    <div className="main_nav_logo">
                        <h3>Dream Events</h3>
                    </div>
        
                    <nav className="main_nav_items">
                        <ul>
                            <li>
                                <NavLink to='/events'>
                                    Events
                                </NavLink>
                            </li>
        
                            {context.token && <React.Fragment><li>
                                <NavLink to='/bookings'>
                                Bookings
                                </NavLink>
                            </li><li>
                            <button onClick={context.logout} style = {{
                                background:'none',
                                color:'white',
                                fontSize:'15px',
                                border:'none',
                                cursor:'pointer'
                            }}>
                                Log Out
                                </button>
                                </li></React.Fragment>}

                            {!context.token && 
                            <li>
                                <NavLink to='/auth'>
                                    Authenticate
                                </NavLink>
                            </li>}
                        </ul>
                    </nav>
                </header>
                
            )
        }}
        </AuthContext.Consumer>
    
);

export default MainNav;