const CountryInfo = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital[0]}</div>
      <div>Area: {country.area}</div>
      <div style={{marginTop: '1rem'}}>
        <strong>Languages</strong>
        <ul>
          {Object.values(country.languages).map(
            language => <li key={language}>{language}</li>
          )}
        </ul>
      </div>
      <div style={{marginTop: '1rem'}}>
        <img src={country.flags.png}></img>
      </div>
    </div>
  );
}

export default CountryInfo;