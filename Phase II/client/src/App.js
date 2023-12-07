import Admin from './Pages/Admin/Admin';
import { Navigate, Routes, Route } from 'react-router-dom';
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
import ChatRoom from './Pages/ChatRoom/ChatRoom';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

function App() {
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(postData);

  const ErrorMessage = () => (
    <div>
      <h2>Access Denied</h2>
      <p>You do not have permission to access this page.</p>
    </div>
  );

  const handleSearch = async (type, query) => {
    try {
      let endpoint;

      if (type === 'author') {
        endpoint = `http://localhost:3001/get-posts-by-author/${query}`;
      } else if (type === 'keyword') {
        endpoint = `http://localhost:3001/get-posts-by-keyword/${query}`;
      } else {
        // Handle other types if needed
        return;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      // Update the filtered posts in the state
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const loggedInUserConfig = {
      method: "GET",
      url: `http://localhost:3001/get-user`,
      headers: {
          Authorization: `Bearer ${token}`,
      },
    };

    const postConfig = {
      method: 'GET',
      url: 'http://localhost:3001/get-post',
    };    

    axios(loggedInUserConfig)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })

    const getAllPosts = () => {
      axios(postConfig)
        .then((res) => {
          setPostData(res.data);
          console.log("Fetched Posts:", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllPosts();
  }, []);

  return (
      <div className="app">
          <Routes>
            {/*Home Surfer User Route*/}
            <Route path='/' element={<Home onSearch={handleSearch} filteredPosts={filteredPosts}/>}/>

            {/*Admin Route*/}
            <Route
              path='/admin'
              element={
                userData && userData.adminUser ? (
                  <Admin />
                ) : (
                  // You can customize this part to redirect to another page or show an error message
                  <ErrorMessage />
                )
              }
            />

            {/*Signup Route*/}
            <Route path='/signup' element={<Signup/>}/>

            {/*Login Route*/}
            <Route path='/login' element={<Login/>}/> 

            {/*Profile Route*/}
            <Route path="/profile/:username" element={<Profile/>} />

            {/*Trending Route*/}
            <Route path='/trending' element={<Trending/>}/> 

            {/*Postings Route*/}
            <Route path='/job-postings' element={<JobPostings onSearch={handleSearch} filteredPosts={filteredPosts}/>}/> 

            {/*Payment Route*/}
            <Route path='/payment' element={<Payment/>}/> 

            {/*Settings Route*/}
            <Route path='/settings' element={<Settings/>}/> 

            {/* Chat Room (VERY EARLY TESTING) */}
            <Route path='chat'element={<ChatRoom/>}/>
          </Routes>
      </div>
  );
}

export default App;
