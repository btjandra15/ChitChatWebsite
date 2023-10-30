/* eslint-disable react/jsx-pascal-case */
import './App.css';
import Admin from './Pages/Admin/Admin';
import Home_SurferUsers from "./Pages/Home/Surfer Page/Home_SurferUsers";
import Home_LoggedUsers from "./Pages/Home/Logged Users/Home_LoggedUsers";
import NavBarSide from "./Pages/NavBar/NavBarSide";
import Widgets from './Pages/Widgets/Widgets';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./Pages/Signup/Signup"
import Login from './Pages/Login/Login'
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
      <div className="app">
          <Routes>
            {/*Home Surfer User Route*/}
            <Route path='/' element={
                <>
                  <NavBarSide/>
                  <Home_SurferUsers/>
                  <Widgets/>
                </>
              }
            />

            {/*Admin Route*/}
            <Route path='/admin' element={<Admin/>}/>

            {/*Signup Route*/}
            <Route path='/signup' element={<Signup/>}/>

            {/*Login Route*/}
            <Route path='/login' element={<Login/>}/> 
          </Routes>
      </div>
  );
}

export default App;
