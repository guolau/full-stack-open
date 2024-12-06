import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '123-4567890'
    }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName )) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName('');
    setNewNumber('');
    setFilterKeyword('');
  }

  const displayedPersons = filterKeyword === ''
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(filterKeyword.toLowerCase()));

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        filter shown with <input value={filterKeyword} onChange={(event) => { setFilterKeyword(event.target.value); }}
        />
      </div>
      <h2>Add New</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
        </div>
        <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {displayedPersons.map((person) => <div key={person.name}>{person.name}   {person.number}</div>)}
    </div>
  );
}

export default App