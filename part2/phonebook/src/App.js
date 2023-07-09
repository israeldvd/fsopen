import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterEntry, setFilterEntry] = useState("");

  useEffect(() => {
    personService.getAll().then((personsList) => {
      setPersons(personsList);
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

    personService.create(person).then((newPerson) => {
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
      setFilterEntry("");
    });
  };

  const removePerson = (personId) => {
    const personName = persons.find((p) => p.id === personId).name;

    const confirmDelete = window.confirm(`Delete ${personName}?`);
    if (!confirmDelete) return;

    personService
      .remove(personId)
      .then((_data) => {
        // _data comes empty at delete request
        setPersons(
          persons.filter((p) => {
            return p.id !== personId;
          })
        );
      })
      .catch((reason) => {
        const errorMessagePreffix =
          "Could not remove person. Something went wrong.";

        console.log(errorMessagePreffix, "Error:", reason);
        alert(errorMessagePreffix);
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
      <Persons personsList={personsToShow} remove={removePerson} />
    </div>
  );
};

export default App;
