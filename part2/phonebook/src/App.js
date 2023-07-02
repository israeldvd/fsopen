import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "040-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

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
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={(event) => {
              setNewName(event.target.value);
            }}
          />
        </div>
        <div>
          number:{" "}
          <input
            value={newPhone}
            onChange={(event) => {
              setNewPhone(event.target.value);
            }}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.name}>
            <p>
              {person.name} {person.phone}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
