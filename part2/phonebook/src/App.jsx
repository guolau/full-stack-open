import { useState, useEffect } from 'react';
import personService from './services/persons.js';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [message, setMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('');
  const NOTIFICATION_TYPE = { success: 'success', error: 'error' };
  
  useEffect(() => {
    personService.index()
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());

    if (existingPerson !== undefined) {
      if (confirm(`${newName} is already added to phonebook. Replace the old number with the new one?`)) {
        personService.update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(response => {
            setPersons(persons.map((person) =>
                person.id === existingPerson.id ? response.data : person
              )
            );

            showNotification(`Updated contact ${response.data.name}`, NOTIFICATION_TYPE.success);

            setNewName('');
            setNewNumber('');
            setFilterKeyword('');        
          })
          .catch(error => {
            showNotification(
              `Contact ${existingPerson.name} has already been removed`,
              NOTIFICATION_TYPE.error
            );
          });
      }
    }

    else {
      personService.create({ name: newName, number: newNumber })
        .then(response => {
          setPersons(persons.concat(response.data));

          showNotification(`Created contact ${response.data.name}`, NOTIFICATION_TYPE.success);

          setNewName('');
          setNewNumber('');
          setFilterKeyword('');        
        });
    }  
  }

  const removePerson = (removedPerson) => {
    if (!confirm(`Are you sure you want to delete ${removedPerson.name}?`)) {
      return;
    }

    personService.remove(removedPerson.id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== response.data.id));
        showNotification(`Removed contact ${response.data.name}`, NOTIFICATION_TYPE.success);
      })
      .catch(error => {
        showNotification(
          `Contact ${removedPerson.name} has already been removed`,
          NOTIFICATION_TYPE.error
        );
      });
  };

  const showNotification = (message, type) => {
    setMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }

  const displayedPersons = filterKeyword === ''
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(filterKeyword.toLowerCase()));

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} type={notificationType} />
      <Filter keyword={filterKeyword} handleChange={setFilterKeyword} />
      <h2>Add New</h2>
      <PersonForm name={newName} number={newNumber}
        handleNameChange={setNewName} handleNumberChange={setNewNumber}
        handleSubmit={addPerson} />
      <h2>Numbers</h2>
      <Persons displayedPersons={displayedPersons} handleDelete={removePerson} />
    </div>
  );
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={`${type} notification`}>
      {message}
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

export default App