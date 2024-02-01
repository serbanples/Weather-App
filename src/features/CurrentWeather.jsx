import React from 'react'
import { useState } from 'react';

const CurrentWeather = ({ onAddToFavorites }) => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
  
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          setWeatherData(data);
          setError(null);
        } else {
          setError(data.error || 'Error fetching weather data');
          setWeatherData(null);
        }
      } catch (error) {
        setError('Error fetching weather data');
        setWeatherData(null);
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      fetchWeatherData();
    };
  
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-semibold mb-4">Weather App</h1>
  
        <form onSubmit={handleSubmit} className="mb-4">
          <label htmlFor="city" className="mr-2">Enter City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded p-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">Get Weather</button>
        </form>
  
        {error && <p className="text-red-500">{error}</p>}
  
        {weatherData && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Weather in {weatherData.name}, {weatherData.sys.country}</h2>
              <p>Temperature: {(weatherData.main.temp - 273.15).toFixed(1)} &#8451;</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Weather: {weatherData.weather[0].description}</p>
              <p>Cloudiness: {weatherData.clouds.all}%</p>
              <p>Visibility: {(weatherData.visibility/10000).toFixed(1)} km</p>
              <p>Wind Speed: {(weatherData.wind.speed*3.6).toFixed(0)} km/h</p>
              {weatherData.weather[0].icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              )}
            <button 
              onClick={() => 
                onAddToFavorites({
                    name: weatherData.name,
                })
              } 
              className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded">Add to Favorites</button>
          </div>
        )}
  
      </div>
    );
}

export default CurrentWeather