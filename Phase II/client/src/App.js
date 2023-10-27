import './App.css';
import Admin from './Pages/Admin/Admin';
import Home from "./Pages/Home/Surfer Page/Home";
import NavBarSide from "./Pages/NavBar/NavBarSide";
import Widgets from './Pages/Widgets/Widgets';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./Pages/Signup/Signup"

function App() {
  return (
    <Router>
      <div className="app">
          <Routes>
            {/*Home Route*/}
            <Route path='/' element={
              <>
                <NavBarSide/>
                <Home/>
                <Widgets/>
              </>
            }/>

            {/*Admin Route*/}
            <Route path='/admin' element={<Admin/>}/>

            {/*Signup Route*/}
            <Route path='/signup' element={<Signup/>}/>
          </Routes>
      </div>
    </Router>
  );
}

export default App;
