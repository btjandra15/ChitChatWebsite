import React from "react";
import "./Home.scss"
import Navbar from "./components/Navbar/Navbar";
import Leftbar from "./components/LeftBar/Leftbar";
import Rightbar from "./components/RightBar/Rightbar";
import MiddleBar from "./components/MiddleBar/MiddleBar";
import "../../styles.scss"

const Home = () => {
    return(
        <div className='home'>
            <Navbar/>

            <div className="main-content">
                <Leftbar/>

                <div style={{flex: 6}}>
                    <MiddleBar/>
                </div>
                
                <Rightbar/>
            </div>
        </div>
    )
};

export default Home;
