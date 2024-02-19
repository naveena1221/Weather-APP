import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import { Link, useLocation } from 'react-router-dom';


function HourlyUpdate() {
    // const location=useLocation();
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [hourlyData, setHourlyData] = useState(null);
    const [loading, setLoading] = useState(true);
    // console.log(location?.state?.longitude, location?.state?.latitude);
    const {state:{latitude,longitude,city}}=useLocation();
    console.log(latitude,longitude,city);


    const fetchHourlyData = async () => {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,snowfall,cloud_cover,wind_speed_10m&forecast_days=1`, { method: "GET" });
            const data = await response.json();
            setHourlyData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hourly data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (loading) {
            fetchHourlyData();
        }
    }, []);

    useEffect(() => {
        if (hourlyData) {
            renderChart();
        }
    }, [hourlyData]);

    const renderChart = () => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const labels = hourlyData.hourly.time.map((time) => new Date(time).toLocaleTimeString());
        const temperatureData = hourlyData.hourly.temperature_2m;
        const rainfallData = hourlyData.hourly.rain;
        const snowfallData = hourlyData.hourly.snowfall;
        const cloudCoverData = hourlyData.hourly.cloud_cover;
        const windSpeedData = hourlyData.hourly.wind_speed_10m;

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                },
                {
                    label: 'Rainfall (mm)',
                    data: rainfallData,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                },
                {
                    label: 'Snowfall (cm)',
                    data: snowfallData,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                },
                {
                    label: 'Cloud Cover (%)',
                    data: cloudCoverData,
                    borderColor: 'orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.2)',
                },
                {
                    label: 'Wind Speed (km/h)',
                    data: windSpeedData,
                    borderColor: 'purple',
                    backgroundColor: 'rgba(128, 0, 128, 0.2)',
                },
            ],
        };

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: 'white', // Set legend label color to white
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'white', // Set x-axis label font color to white
                        },
                    },
                    y: {
                        ticks: {
                            color: 'white', // Set y-axis label font color to white
                        },
                    },
                },
            },
            
        });
    };

    

    const getOverallDescription = () => {
        if (!hourlyData || !hourlyData.hourly || !hourlyData.hourly.temperature_2m) {
            console.error('Invalid hourly data:', hourlyData);
            return 'Weather data not available.';
        }
    
        const { temperature_2m, rain, snowfall } = hourlyData.hourly;
        const averageTemp = temperature_2m.reduce((acc, val) => acc + val, 0) / temperature_2m.length;
    
        if (averageTemp > 28) {
            return 'It\'s hot today. Remember to stay hydrated and drink plenty of water!';
        } else if (rain.some(value => value > 0)) {
            return 'It\'s raining today. Consider taking an umbrella!';
        } else if (snowfall.some(value => value > 0)) {
            return 'It\'s snowing today. Bundle up and stay warm!';
        } else {
            return 'Weather looks good for outdoor activities!';
        }
    };
    

    return (

       
        <div style={{background: 'linear-gradient(to bottom, #6EB1D6, #003A6B)',minHeight: '100vh', padding:'20px'}}>
        <h2 style={{ display: 'flex', justifyContent: 'center' }}>Hourly Update in  {city}</h2>
            {loading ? (
                <div style={{display:'flex', justifyContent:'center'}}>Loading...</div>
            ) : (
                
                <div style={{ width: '800px', height: '400px', margin: '20px auto', color: 'white' }}>
                    <canvas ref={canvasRef} id="hourly-chart" />
                </div>
            )}
            <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
               
                {hourlyData && hourlyData.timezone && (
                    <div>Location: {city}</div>
                )}
               
                {hourlyData && hourlyData.hourly && hourlyData.hourly.temperature_2m && (
                    <div>Average Temperature: {Math.round(hourlyData.hourly.temperature_2m.reduce((acc, val) => acc + val, 0) / hourlyData.hourly.temperature_2m.length)}°C</div>
                )}
                
                <div>Description: {getOverallDescription()}</div>
                <div>
            
        </div>
        <button className="btn btn-primary" style={{margin:'10px'}}>
                <Link to="/" style={{color:'white', textDecoration:'none'}}>Go to Home</Link>
            </button>
            </div>
        </div>
    );
}

export default HourlyUpdate;
