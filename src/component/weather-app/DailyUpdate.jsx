import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import rain from '../assets/rain.png';
import cloud from '../assets/cloud.png';
import snow from '../assets/snow.png';


function DailyUpdate() {
    const [loading,setLoading]=useState(true);
    const [dailyData, setDailyData]=useState(null);
    const {state:{latitude,longitude,city}}=useLocation();

    const fetchDailyData=async()=>{
        try{
            const response= await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,rain_sum,showers_sum,snowfall_sum,wind_speed_10m_max`, {method:"GET"});
            const data= await response.json();
            setDailyData(data);
            setLoading(false);
        }
        catch(error){
                console.error('Error fetching daily data:', error)
                setLoading(false);
        }
        

    }

    useEffect(()=>{
        if(loading){
            fetchDailyData();
        }

    },[])
    
      const renderWeatherIcon = (rainSum, snowSum) => {
        if (rainSum > 0) { // Rain
            return <img src={rain} alt="Rain" style={{ maxWidth: '50px' }} />;
        } else if (snowSum > 0) { // Snow
            return <img src={snow} alt="Snow" style={{ maxWidth: '50px' }} />;
        } else { // Cloudy
            return <img src={cloud} alt="Cloudy" style={{ maxWidth: '50px' }} />;
        }
    }
    const renderMessage = () => {
        if (!dailyData) return null;

        let consecutiveRainSnowFreeDays = 0;
        for (let i = 0; i < dailyData.daily.time.length; i++) {
            const isRainyDay = dailyData.daily.rain_sum[i] > 0;
            const isSnowyDay = dailyData.daily.snowfall_sum[i] > 0;

            if (!isRainyDay && !isSnowyDay) {
                consecutiveRainSnowFreeDays++;
            } else {
                consecutiveRainSnowFreeDays = 0; 
            }

            if (consecutiveRainSnowFreeDays >= 2) {
                return (
                    "Tip: Good time to spray pesticides to crops, plan outdoor events, or go on a trip!"
                );
            }
        }

        return null; 
    }
      


    return (
        <div style={{textAlign:'center',background: 'linear-gradient(to bottom, #6EB1D6, #003A6B)',minHeight: '100vh', padding:'20px'}}>
            <h2 style={{textAlign:'center'}}>{city}</h2>
            <div className="daily-weather-container" style={{ display: 'flex', justifyContent: 'space-around', margin: '20px auto', maxWidth: '1400px' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : dailyData ? (
                    dailyData.daily.time.map((day, index) => (
                        <div key={index} className="daily-weather-card" style={{background: 'rgba(255, 255, 255, 0.15)',backdropFilter: 'blur(10px)', borderRadius: '10px', padding:'20px',margin:'10px', width: '800px'}}>
                            <div className="date">{new Date(day).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                            <div className="weather-info">
                                <div className="weather-icon" >{renderWeatherIcon(dailyData.daily.rain_sum[index], dailyData.daily.snowfall_sum[index])}</div>
                                <div className="temperature">Temp: {dailyData.daily.temperature_2m_max[index]}°C</div>
                            </div>
                            <div className="details">
                                Rain: {dailyData.daily.rain_sum[index]} mm <br/>
                                Snow: {dailyData.daily.snowfall_sum[index]} cm
                            </div>
                        </div>
                    ))
                ) : null}
            </div>
            {dailyData && (
                <div style={{ textAlign: 'center', margin: '20px auto' }}>
                    {renderMessage()}
                </div>

            )}
            <button className="btn btn-primary" style={{margin:'10px'}}>
                <Link to="/" style={{color:'white', textDecoration:'none'}}>Go to Home</Link>
            </button>
            
        </div>
    );
}

export default DailyUpdate