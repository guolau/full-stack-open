const Filter = ({ keyword, handleChange }) => {
  return (
    <div>
      filter shown with <input value={keyword} onChange={(event) => { handleChange(event.target.value); }}
        />
    </div>
  );
}

export default Filter;