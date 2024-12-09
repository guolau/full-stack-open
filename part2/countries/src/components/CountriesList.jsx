const CountriesList = ({ countries, handleShowCountry }) => {
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
      {countries.map(country => {
        return <div
            key={country.name.official}
            style={{ display: 'flex', gap: '0.25rem' }}>
          <span>{country.name.common}</span>
          <button onClick={() => handleShowCountry(country)}>show</button>
        </div>
      })}
    </div>
  );
}

export default CountriesList;