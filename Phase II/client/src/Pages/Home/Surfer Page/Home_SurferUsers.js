import React from "react";
import "../Surfer Page/Home.css"
import SearchBar from "../../searchbar.js";
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
                <form action="">
                    <Avatar/>

                    <div className="post-box-form-field">
                        <div className="post-box-input">
                            <input type="text" placeholder="What's happening?"/>
                        </div>
                        <div className="post-box-input">
                           <div className="post-box-icons">
                                <ImageOutlined/>
                                <GifBoxOutlined/>
                                <PollOutlined/>
                                <SentimentSatisfiedAltOutlined/>
                                <CalendarTodayOutlined/>
                                <LocationCityOutlined/>
                           </div>

                           <button>Post</button>
                        </div>
                    </div>
                </form>
                <SearchBar />
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
