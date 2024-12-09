const Persons = ({displayedPersons, handleDelete}) => {
  return (
    displayedPersons.map((person) =>
      <div key={person.name}>
        <span style={{marginRight: '0.65rem'}}>{person.name}</span>
        <span style={{marginRight: '0.65rem'}}>{person.number}</span>
        <button onClick={() => handleDelete(person)}>delete</button>
      </div>
    )
  );
}

export default Persons;