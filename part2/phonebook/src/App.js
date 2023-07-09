import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterEntry, setFilterEntry] = useState("");

  const baseUrl = "http://localhost:3001/persons";

  useEffect(() => {
    axios.get(baseUrl).then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const person = {
      name: newName,
      number: newNumber,
    };

    const personAlreadyExists = persons.some((person) => {
      return person.name === newName;
    });

    if (personAlreadyExists)
      return alert(`${newName} is already added to phonebook`);

    axios.post(baseUrl, person).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName("");
      setNewNumber("");
      setFilterEntry("");
    });
  };

  const personsToShow = persons.filter((val) => {
    const upperCaseName = val.name.toUpperCase();
    const upperCaseFilterEntry = filterEntry.toUpperCase();

    return upperCaseName.includes(upperCaseFilterEntry);
  });

  return (
    <div>
      <h1>Phonebook</h1>

      <h2>Filter</h2>
      <Filter
        filterEntry={filterEntry}
        onWriteFilter={(e) => {
          setFilterEntry(e.target.value);
        }}
      />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onAddPerson={addPerson}
        onTypeName={(e) => {
          setNewName(e.target.value);
        }}
        onTypePhoneNumber={(e) => {
          setNewNumber(e.target.value);
        }}
      />

      <h2>Numbers</h2>
      <Persons personsList={personsToShow} />
    </div>
  );
};

export default App;
