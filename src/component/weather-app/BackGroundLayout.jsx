import React, { useEffect, useState } from 'react';
import Cloudy from '../assets/Cloudy.jpg';
import Clear from '../assets/Clear.jpg';
import Rainy from '../assets/Rainy.jpg';
import Snow from '../assets/Snowy.jpg';
function BackGroundLayout({ weatherData, children }) {
    const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (weatherData) {
      // Determine background image based on weather conditions
      const condition = weatherData.weather[0].main.toLowerCase();
      switch (condition) {
        case 'clear':
          setBackgroundImage(Clear);
          
          break;
        case 'clouds':
          setBackgroundImage(Cloudy);
          break;
        case 'rain':
        case 'drizzle':
          setBackgroundImage(Rainy);
          break;
        case 'snow': setBackgroundImage(Snow);
        break;
        default:
          setBackgroundImage(Clear); // Default background image
          break;
      }
    }
  }, [weatherData]);

  return (
    <div className="background-layout" style={{ backgroundImage: `url(${backgroundImage})`, minHeight:'100vh',margin:'0px',padding:'0px' }}>
      {children}
    </div>
  );
}

export default BackGroundLayout