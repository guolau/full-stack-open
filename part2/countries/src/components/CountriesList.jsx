const CountriesList = ({ countries }) => {
  if (countries.length == 0) {
    return (
      <div>No countries to display</div>
    );
  }
    
  if (countries.length > 10) {
    return (
      <div>Too many matches, try a longer search term</div>
    );
  }
  
  return (
    <div>
      {countries.map(country => <div key={country.name.official}>{country.name.common}</div>)}
    </div>
  );
}

export default CountriesList;