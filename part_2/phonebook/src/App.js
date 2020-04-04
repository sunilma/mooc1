import React, { useState, useEffect } from 'react';

import { getAll, addOne, removeOne, updateOne } from './services/persons';


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

const Person = ({person: {id, name, number}, handleDelete}) => (
    <p>{name}{" "}{number}<button onClick={() => handleDelete(id)}>Delete</button></p>
);


const Persons = ({persons, filter, handleDelete}) => {
    if(persons.length > 0) {
        return persons.filter(person => person.name.toLowerCase().includes(filter))
        .map(person => <Person key={person.id} person={person} handleDelete={handleDelete} />)
    } else {
        return <p>Loading...</p>;
    }
}


const Notification = ({message}) => {
    if (message === null) {
      return null
    }

    const myColor = message.type === 'success' ? 'green' : 'red';
  
    return (
      <div className="error" style={{color: `${myColor}`}} >
        {message.msg}
      </div>
    )
  }

const App = () => {
  const [ persons, setPersons] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ message, setMessage ] = useState(null);

  useEffect(() => {
      getAll().then(response => {
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

      const isExists = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase());       
        
      if(isExists.length > 0) {
        if(window.confirm(`${newName} already exists in the phonebook, replace the old number with a new one?`)){
            const data = {name: newName, number: newNumber};
            updateOne(isExists[0].id, data)
            .then(response => {
                const temp = persons.filter(person => person.id !== response.data.id);
                setPersons([...temp, response.data]);
            })
            .catch(error => {
              setMessage({msg:`${data.name} has already been removed from the database`, type: 'error'});
              setTimeout(() => {
                  setMessage(null);
              }, 5000);
            });
        }
      } else {
        const person = {
            name: newName,
            number: newNumber
        };
  
        addOne(person).then(response => {
              setPersons([...persons, response.data]);
              setMessage({msg:`Added ${person.name}`, type: 'success'});
              setTimeout(() => {
                  setMessage(null);
              }, 5000);
          });
      }      
  }

  const handleDelete = (id) => {
    if (window.confirm("are you sure?")) { 
        removeOne(id).then(response => {
            const newPersons = persons.filter(person => person.id !== id);
            setPersons([...newPersons]);
        }).catch(error => {
            setMessage({msg:'error occured during deletion', type: 'error'});
              setTimeout(() => {
                  setMessage(null);
              }, 5000);
        });
      }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter name={filter} value={filter} handleChange={handleChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  )
}

export default App;