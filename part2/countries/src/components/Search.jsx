const Search = ({ keyword, handleChange }) => {
  return (
    <div>
      Find countries <input value={keyword} onChange={(event) => { handleChange(event.target.value); }}
        />
    </div>
  );
}

export default Search;