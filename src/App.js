import React, { useState } from 'react';
import CurrentWeather from './features/CurrentWeather';
import FavoritesTab from './features/FavoritesTab';
import './index.css'

const App = () => {
  const [favoriteCities, setFavoriteCities] = useState([]);

  const addToFavorites = async (newFavorite) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/add-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFavorite),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        setFavoriteCities([...favoriteCities, newFavorite]);
      } else {
        console.error(data.error || 'Error adding to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error.message);
    }
  };

  const [selectedCity, setSelectedCity] = useState(null);

  const handleDetails = (cityName) => {
    // Implement the logic to fetch details for the cityName
    console.log(`Fetching details for ${cityName}`);
    setSelectedCity(cityName);
  };

  return(
    <div className='flex'>
      <FavoritesTab favoriteCities={favoriteCities} setFavoriteCities={setFavoriteCities} onDetails = {handleDetails}/>
      <div className='flex-grow p-4 bg-white'>
        <CurrentWeather onAddToFavorites={ addToFavorites } setSelectedCity= {setSelectedCity}/>
      </div>
    </div>
  )
};

export default App;