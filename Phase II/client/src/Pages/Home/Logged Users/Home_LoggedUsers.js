import React from "react";
import "../Surfer Page/Home.css"
import HomeOptions from "./HomeOptions";
import { Avatar } from "@mui/material";
import { ImageOutlined, GifBoxOutlined, PollOutlined, SentimentSatisfiedAltOutlined, CalendarTodayOutlined, LocationCityOutlined } from "@mui/icons-material";

const Home = () => {
    return(
        <div className='home'>
            <div className='home__top'>
                <HomeOptions text="For you"/>
                <HomeOptions text="Following"/>
            </div>

            <div className="post-box">
    <form>
      <div className="post-box-input">
          <Avatar/>
          <input placeholder="What's Happening?" type="text"/>
        </div> 
    
            <div class="button-container">
            <button className="Image-Video">
                Image/Video
                </button>
            <button className="Tweet">Post</button> 
            </div>
    </form>
</div>

            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
            <h3>Lorem ipsum</h3>
        </div>
    )
};

export default Home;
