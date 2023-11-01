import React from "react";
import "../Surfer Page/Home.css"
import SearchBar from "../../searchbar.js";
import HomeOptions from "./HomeOptions";
import { Avatar } from "@mui/material";
import { ImageOutlined, GifBoxOutlined, PollOutlined, SentimentSatisfiedAltOutlined, CalendarTodayOutlined, LocationCityOutlined, Widgets } from "@mui/icons-material";
import NavBarSide from "../../NavBar/NavBarSide";
import NavWidgets from "../../Widgets/NavWidgets";

const Home = () => {
    return(
        <div className='home__grid'>
            <NavBarSide/>
            <div className="home">
                <div className='home__top'>
                    <HomeOptions text="For you"/>
                    <HomeOptions text="Following"/>
                </div>

                {/* <div className="post-box">
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
<<<<<<< HEAD
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
=======
                    </form>
                </div> */}

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
            <NavWidgets/>
>>>>>>> 81a85224d370e0f4021ef70d854850406f2ea16a
        </div>
    )
};

export default Home;
