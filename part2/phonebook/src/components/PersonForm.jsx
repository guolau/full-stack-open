const PersonForm = ({name, number, handleNameChange, handleNumberChange, handleSubmit}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={name} onChange={(event) => handleNameChange(event.target.value)} />
      </div>
      <div>number: <input value={number} onChange={(event) => handleNumberChange(event.target.value)} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default PersonForm;