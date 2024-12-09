import { useState, useEffect } from 'react';
import axios from "axios";
const weatherApiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

const CountryInfo = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: country.capitalInfo.latlng[0],
        lon: country.capitalInfo.latlng[1],
        appid: weatherApiKey,
        units: 'metric',
      }
    })
    .then(response => {
      setWeatherData(response.data);
    })
    .catch(error => {
      alert('Unable to load weather data');
    });
  }, [])
  
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital[0]}</div>
      <div>Area: {country.area}</div>
      <div style={{marginTop: '1rem'}}>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map(
            language => <li key={language}>{language}</li>
          )}
        </ul>
      </div>
      <div style={{marginTop: '1rem'}}>
        <img src={country.flags.png}></img>
      </div>
      {
        weatherData &&
        <div>
          <h3>Weather in {country.capital[0]}</h3>
            <div>Temperature: {weatherData.main.temp}°C</div>
            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}></img>
            <div>Wind: {weatherData.wind.speed} m/s</div>
        </div>
      }
    </div>
  );
}

export default CountryInfo;