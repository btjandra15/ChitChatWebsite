import Admin from './Pages/Admin/Admin';
import { Routes, Route } from 'react-router-dom';
import Signup from "./Pages/Signup/Signup"
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Trending from './Pages/Trending/Trending';
import Payment from './Pages/Payment/Payment';
import Settings from './Pages/Settings/Settings';
import Posting from './Pages/Postings/Posting';

function App() {
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
            <Route path='/profile/:id' element={<Profile/>}/> 

            {/*Trending Route*/}
            <Route path='/trending' element={<Trending/>}/> 

            {/*Postings Route*/}
            <Route path='/postings' element={<Posting/>}/> 

            {/*Payment Route*/}
            <Route path='/payment' element={<Payment/>}/> 

            {/*Settings Route*/}
            <Route path='/settings' element={<Settings/>}/> 
          </Routes>
      </div>
  );
}

export default App;
