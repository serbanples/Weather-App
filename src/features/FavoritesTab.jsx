import React, { useEffect, useState } from 'react';
import WeatherCityCard from './WeatherCityCard';

const FavoritesTab = ({ favoriteCities, setFavoriteCities, onDetails }) => {
  const [ isCleared, setIsCleared ] = useState(false);
  const [ weatherData, setWeatherData] = useState({});
  const [ error, setError] = useState(null);


  useEffect(() => {
    const fetchFavoriteCities = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/favorites');
          const data = await response.json();
          
          if (response.ok) {
            setFavoriteCities(data);
          } else {
            console.error(data.error || 'Error fetching favorite cities');
          }
        } catch (error) {
          console.error('Error fetching favorite cities:', error);
        }
      };

    fetchFavoriteCities();
    setIsCleared(false);
  }, [setFavoriteCities, isCleared]); 

  const clearFavorites = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        setFavoriteCities([]);
        setIsCleared(true);
      } else {
        console.error(data.error || 'Error clearing favorites');
      }
    } catch (error) {
      console.error('Error clearing favorites:', error.message);
    }
  };

  useEffect(() => {
    const fetchWeatherData = async (cityName) => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city: cityName }),
        });

        const data = await response.json();

        if (response.ok) {
          setWeatherData((prevData) => ({
            ...prevData,
            [cityName]: {
              temperature: (data.main.temp - 273.15).toFixed(0),
              country: data.sys.country,
              description: data.weather[0].description,
            },
          }));
          setError(null);
        } else {
          setError(data.error || 'Error fetching weather data');
        }
      } catch (error) {
        setError('Error fetching weather data');
      }
    };

    favoriteCities.forEach((city) => {
      fetchWeatherData(city.name);
    });
  }, [favoriteCities]);

  const removeFromFavorites = async (cityName) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/remove-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: cityName }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        setFavoriteCities((prevCities) => prevCities.filter((city) => city.name !== cityName));
      } else {
        console.error(data.error || 'Error removing from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error.message);
    }
  };

  return (
      <div className='flex flex-col flex-shrink-0 flex-grow-0 w-48 p-4'>
        {favoriteCities.map((city) => (
          <div key = {city.id}>
            <WeatherCityCard
              key={city.id}
              name={city.name}
              country={weatherData[city.name]?.country}
              temperature={weatherData[city.name]?.temperature}
              description={weatherData[city.name]?.description}
              onRemove={() => removeFromFavorites(city.name)}
              onDetails={() => onDetails(city.name)}
            />
          </div>
        ))}
        {favoriteCities.length > 0 && (
          <button onClick={clearFavorites} className="bg-red-500 text-white px-4 py-2 mt-2 rounded">Clear Favorites</button>
        )}
    </div>
  );
};

export default FavoritesTab;
