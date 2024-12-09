import { useState, useEffect } from 'react';
import Search from './components/Search.jsx';
import CountriesList from './components/CountriesList.jsx';
import CountryInfo from './components/CountryInfo.jsx';
import countriesService from './services/countries.js';

function App() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (searchKeyword) {
      countriesService.index()
        .then(response => {
          let filteredCountries = response.data.filter(
            country => country.name.common.toLowerCase().includes(searchKeyword.toLowerCase())
          );

          setCountries(filteredCountries);
          
          if (filteredCountries.length === 1) {
            setSelectedCountry(filteredCountries[0]);
          } else {
            setSelectedCountry(null);
          }
        })
        .catch(error => {
          alert('Unable to fetch countries list');
        });
    } else {
      setCountries([]);
    }

  }, [searchKeyword])

  return (
    <>
    <h1>Country Info</h1>
    <div>
      <Search keyword={searchKeyword} handleChange={setSearchKeyword}></Search>
      {countries.length !== 1 && <CountriesList countries={countries} />}
      {selectedCountry && <CountryInfo country={selectedCountry} />}
    </div>
    </>
  );
}

export default App
