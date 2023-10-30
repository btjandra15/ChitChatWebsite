import React from 'react'
import "./Home.css"

const HomeOptions = ({text}) => {
    return(
        <div className="homeOptions">
            <h2>{text}</h2>
        </div>
    );
};

export default HomeOptions