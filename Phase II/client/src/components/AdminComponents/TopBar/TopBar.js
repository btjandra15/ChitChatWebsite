import React from 'react'
import { Link } from 'react-router-dom'
import "./TopBar.scss"
import ChitChatLogo2 from "../../../images/ChitChatLogo2.png";

function TopBar() {
    document.addEventListener("scroll", function () {
        const content = document.querySelector(".top-bar");
        const scrollPosition = window.scrollY;
        const triggerScrollPosition = 15; // Adjust this value to set when the effect starts
        
        if (scrollPosition > triggerScrollPosition) {
            content.style.opacity = "0.5"; // Set the desired opacity when scrolling down
        } else {
            content.style.opacity = "1"; // Reset opacity when scrolling up
        }
        });

    return (
        <div className="top-bar">
            <div className="left">
                <Link className="nav-logo" to="/" style={{ textDecoration: 'none' }}>
                    <img src={ChitChatLogo2} alt="ChitChat Logo 2" />
                </Link>
            </div>
            <div className="right">
            </div>
        </div>
    )
}

export default TopBar