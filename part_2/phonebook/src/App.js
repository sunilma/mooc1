import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Filter = ({name, value, handleChange}) => (
    <p>filter shown with <input type="text" name={name} value={value} onChange={handleChange} /></p>
);

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson}) => (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
            number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
);

const Person = ({person: {name, number}}) => (
    <p key={name}>{name}{" "}{number}</p>
);


const Persons = ({persons, filter}) => {
    if(persons.length > 0) {
        return persons.filter(person => person.name.toLowerCase().includes(filter))
        .map(person => <Person key={person.id} person={person} />)
    } else {
        return <p>Loading...</p>;
    }
}


const App = () => {
  const [ persons, setPersons] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  useEffect(() => {
      axios
      .get('http://localhost:3001/persons')
      .then(response => {
          setPersons(response.data);
      });
  }, []);

  const handleNameChange = (event) => {
      setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
      setNewNumber(event.target.value);
    }

    const handleChange = (event) => {
        setFilter(event.target.value);
    }

  const addPerson = (event) => {
      event.preventDefault();

      const isExists = persons.filter(person => person.name.toLowerCase().includes(newName));
        
      if(isExists.length > 0) {
          alert(`${newName} already exists in the phonebook`);
          return;
      }
      
      const person = {
          name: newName,
          number: newNumber
      };

      setPersons([...persons, person]);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name={filter} value={filter} handleChange={handleChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App;