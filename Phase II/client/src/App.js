import Admin from './Pages/Admin/Admin';
import { Routes, Route } from 'react-router-dom';
import Signup from "./Pages/Signup/Signup"
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Trending from './Pages/Trending/Trending';
import Payment from './Pages/Payment/Payment';
import Settings from './Pages/Settings/Settings';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import JobPostings from './Pages/Postings/JobPostings';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loggedInUserConfig = {
      method: "GET",
      url: `http://localhost:3001/get-user`,
      headers: {
          Authorization: `Bearer ${token}`,
      },
    };

    axios(loggedInUserConfig)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
  }, []);

  return (
      <div className="app">
          <Routes>
            {/*Home Surfer User Route*/}
            <Route path='/' element={<Home/>}/>

            {/*Admin Route*/}
            <Route path='/admin' element={<Admin/>}/>

            {/*Signup Route*/}
            <Route path='/signup' element={<Signup/>}/>

            {/*Login Route*/}
            <Route path='/login' element={<Login/>}/> 

            {/*Profile Route*/}
            <Route path={`/profile/${userData ? userData.username : null}`} element={<Profile/>}/> 

            {/*Trending Route*/}
            <Route path='/trending' element={<Trending/>}/> 

            {/*Postings Route*/}
            <Route path='/postings' element={<JobPostings/>}/> 

            {/*Payment Route*/}
            <Route path='/payment' element={<Payment/>}/> 

            {/*Settings Route*/}
            <Route path='/settings' element={<Settings/>}/> 
          </Routes>
      </div>
  );
}

export default App;
