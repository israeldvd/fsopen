import { useState } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "040-123456", id: 1 },
    { name: "Ada Lovelace", phone: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", phone: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", phone: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filterEntry, setFilterEntry] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    const person = {
      name: newName,
      phone: newPhone,
    };

    const personAlreadyExists = persons.some((person) => {
      return person.name === newName;
    });

    if (personAlreadyExists)
      return alert(`${newName} is already added to phonebook`);

    setPersons(persons.concat(person));
    setNewName("");
    setNewPhone("");
    setFilterEntry("");
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
        newPhone={newPhone}
        onAddPerson={addPerson}
        onTypeName={(e) => {
          setNewName(e.target.value);
        }}
        onTypePhone={(e) => {
          setNewPhone(e.target.value);
        }}
      />

      <h2>Numbers</h2>
      <Persons personsList={personsToShow} />
    </div>
  );
};

export default App;
