import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';


const WeatherCityCard = ({ name, country, temperature, description, onRemove, onDetails }) => {
  return (
    <div className="border border-black rounded p-1 bg-gray-200 w-44 relative">
      <h2>{name}, {country}</h2>
      <p>Temperature: {temperature} °C</p>
      <p>Weather: {description}</p>
      <div className='flex-col items-center'>
        <button onClick={() => onDetails(name)} className='bg-blue-500 rounded text-white p-0.5 absolute bottom-0 right-0 m-1'>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button onClick={() => onRemove(name)} className='bg-red-500 rounded text-white p-0.5 absolute top-0 right-0 m-1'>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default WeatherCityCard;