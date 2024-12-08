import { useState, useEffect } from 'react';
import axios from 'axios';
import personService from './services/persons.js';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');

  useEffect(() => {
    personService.index()
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name.toLowerCase() === newName.toLowerCase() )) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber
    };

    personService.create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
        setFilterKeyword('');        
      });
  }

  const displayedPersons = filterKeyword === ''
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(filterKeyword.toLowerCase()));

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter keyword={filterKeyword} handleChange={setFilterKeyword} />
      <h2>Add New</h2>
      <PersonForm name={newName} number={newNumber}
        handleNameChange={setNewName} handleNumberChange={setNewNumber}
        handleSubmit={addPerson} />
      <h2>Numbers</h2>
      <Persons displayedPersons={displayedPersons} />
    </div>
  );
}

const Filter = ({ keyword, handleChange }) => {
  return (
    <div>
      filter shown with <input value={keyword} onChange={(event) => { handleChange(event.target.value); }}
        />
    </div>
  );
}

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

const Persons = ({displayedPersons}) => {
  return (
    displayedPersons.map((person) => <div key={person.name}>{person.name}   {person.number}</div>)
  );
}

export default App