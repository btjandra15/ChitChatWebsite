import './App.css';
import Home from "./Pages/Home/Surfer Page/Home";
import NavBarSide from "./Pages/NavBar/NavBarSide";
import Widgets from './Pages/Widgets/Widgets';

function App() {
  return (
    <div className="app">
      <NavBarSide/>
      <Home/>
      <Widgets/>
    </div>
  );
}

export default App;
