import React,{useState, useEffect} from 'react';
import search_icon from'../assets/search.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import clear_icon from '../assets/clear.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import rain_gif from '../assets/rain.gif';
import { useNavigate}  from 'react-router-dom';
import BackGroundLayout from '../weather-app/BackGroundLayout';

function Home() {

  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

    const Container = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop:'15px',
        color:'#003A6B',
        fontSize:'20px',
        
      };
    const glassEffect = {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '20px',
        width:'500px',
        marginTop:'30px'

      };
      const btnStyle={
        margin:'2px',
        backgroundColor:'#89CFF1',
        color: '#003A6B'

      };

      const apiKey='bd43ebf5004dba725b7c05270aab4146';


    const handleSearch=()=>{
       fetchWeatherData(location)
    }

    const fetchWeatherData= async (location)=>{
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
        );
        if (!response.ok) {
          throw new Error('Location not found. Please enter a valid location or check spelling.');
        }
        const data = await response.json();
        console.log("Fetched weather data:", data);
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message); 
        setLoading(false);
      }
    }
    useEffect(()=>{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          fetchWeatherData('London');
        }
      );

    },[])
    const reverseGeocode = async (latitude, longitude) => {
      try {
          const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`);
          const data = await response.json();
          const cityName = data[0]?.name;
          fetchWeatherData(cityName);
      } catch (error) {
          console.error('Error reverse geocoding:', error);
      }
  }
 const HourlyUpdateHandle=()=>{
  console.log(weatherData, weatherData.coord);
  if (weatherData && weatherData.coord) {
    navigate('/HourlyUpdate', { state: { latitude: weatherData.coord.lat, longitude: weatherData.coord.lon, city: weatherData.name} });
    
  } 
 }
 const DailyUpdateHandle=()=>{
  if (weatherData && weatherData.coord) {
    navigate('/DailyUpdate', { state: { latitude: weatherData.coord.lat, longitude: weatherData.coord.lon, city: weatherData.name} });
    
  } 
 }


  return (
    <div style={{ marginTop:'-15px'}}>
    <BackGroundLayout weatherData={weatherData}>
    <div>
        <div className='container' style={Container}>
        <div className='main' style={glassEffect}>
        <div className='content-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop:'10px',fontFamily:'cursive' }}>
            <div className='search-section' style={{display:'flex',justifyContent:'center',}}>
                <input type='text' className='input' placeholder='  Search' style={{borderRadius:'50px',width:'275px',height:'50px',borderBlockColor:'#003A6B',backgroundColor:'#89CFF1',padding:'20px'}} value={location}
                onChange={(e) => setLocation(e.target.value)} />
                <div style={{margin:'5px',cursor:'pointer',}}>
                    <img src={search_icon} alt='search icon' onClick={handleSearch} />
                </div>
                
            </div>
            {loading ? (
              <div className='LoadingGif' > 
              <p>Loading</p>
              </div>

            ):
            ( weatherData && (
              <>
          
              <div className='weatherImage'>
              {weatherData.weather[0].main === 'Clouds' && <img src={cloud_icon} alt='weather image' />}
                  {weatherData.weather[0].main === 'Drizzle' && <img src={drizzle_icon} alt='weather image' />}
                  {weatherData.weather[0].main === 'Clear' && <img src={clear_icon} alt='weather image' />}
                  {weatherData.weather[0].main === 'Rain' && <img src={rain_icon} alt='weather image' />}
                  {weatherData.weather[0].main === 'Snow' && <img src={snow_icon} alt='weather image' />}
                  </div>
                  <div className='description'>{weatherData.weather[0].description}</div>
                  <span className='city temp' style={{fontSize:'28px'}}>{weatherData.name}, {Math.round(weatherData.main.temp - 273.15)}<sup>o</sup>C</span>
                  
                  <div className='details' >
                                    <div className='detail'>Humidity: {weatherData.main.humidity}%</div>
                                    <div className='detail'>Wind Speed: {weatherData.wind.speed} km/h</div>
                                    <div className='detail'>Visibility: {Math.round(weatherData.visibility / 1609.34)} mi</div>
                                    <div className='detail'>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</div>
                                    <div className='detail'>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</div>
                                </div>
                  </>
            ))}
            

                <div class='buttons' style={{marginTop:'10px',marginBottom:'10px'}}>
                    <button className='btn' style={btnStyle} onClick={HourlyUpdateHandle}>Hourly Update</button>
                    <button className='btn'style={btnStyle} onClick={DailyUpdateHandle}>Daily Update</button>

                </div>
        </div>
        </div>
    </div>
    </div>
    </BackGroundLayout>
    </div>
  )
}

export default Home