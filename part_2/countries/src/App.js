import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Country = ({ country }) => (
  <>
    <h2>{country.name}</h2>
    <br/>
    <p>capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <h3>Languages</h3>
    <ul>
      {
        country.languages.map((language, index) => <li key={index}>{language.name}</li>)
      }
    </ul>
    <img src={country.flag} />
  </>
  );


  const Weather = ({ weather: {location, current} }) => (
    <>
      <h3>Weather in {location.name}</h3>
      <p>{current.weather_descriptions.join(" ")}</p>
      <p>temperature: {current.temperature}</p>
      <img src={current.weather_icons[0]} alt=""/>
      <p>humidity: {current.humidity}</p>
    </>
  )





const App = () => {
  const [ countries, setCountries ] = useState([]);
  const [ filtered, setFiltered ] = useState([]);
  const [ country, setCountry ] = useState({});
  const [ weather, setWeather ] = useState({});
  const apiUrl = "https://restcountries.eu/rest/v2/all";

  useEffect(() => {
    axios.get(apiUrl)
    .then(response => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    if(filtered.length > 0) {
      const apiKey = process.env.REACT_APP_API_KEY;
      const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${filtered[0].capital}`;
      axios.get(apiUrl)
      .then(response => {
        setWeather(response.data);
      });
    }
  }, [filtered]);

  const handleChange = (event) => {
    const filteredCountries = countries.filter(country => {
      return country.name.toLowerCase().includes(event.target.value);
    });
    setFiltered(filteredCountries);
  }

  const displayCountries = () => {
    if(filtered.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if(filtered.length == 1) {
        return (
        <div>
          <Country key={filtered[0].name} country={filtered[0]} />
          {
            Object.keys(weather).length > 0 ? <Weather weather={weather} /> : null
          }
          </div>
        )
    }

    return filtered.map(filter => (
    <p key={filter.name}>{filter.name}<button onClick={() => countryView(filter.name)}>show</button></p>
      ))
  }

  const countryView = (name) => {
    const newCountry = filtered.filter(filter => filter.name === name);
    setCountry(newCountry[0]);
  }


  return (
    <div>
      <p>
        find countries <input type="text" onChange={handleChange} />
      </p>
      {
        displayCountries()        
      }
      {
        Object.keys(country).length > 0 ? <Country key={country.name} country={country} /> : null
      }
    </div>
  );
}

export default App;
