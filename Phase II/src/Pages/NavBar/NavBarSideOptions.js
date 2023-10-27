import React from "react";
import "./NavBar.css"

const NavBarSideOptions = ({active, text, Icon}) => {
    return(
        <div className={`navBarSideOptions ${active && 'navBarSideOptions--active'}`}>
            <Icon/>
            <h2>{text}</h2>
        </div>
    );
};

export default NavBarSideOptions