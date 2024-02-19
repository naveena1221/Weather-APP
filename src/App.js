import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './component/weather-app/Home';
import HourlyUpdate from './component/weather-app/HourlyUpdate';
import DailyUpdate from './component/weather-app/DailyUpdate';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/HourlyUpdate' element={<HourlyUpdate />} />
      <Route path='/DailyUpdate' element={<DailyUpdate />} />
     
    </Routes>
    </BrowserRouter>
  );
}


export default App;
