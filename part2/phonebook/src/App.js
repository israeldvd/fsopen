import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification, {
  setTemporaryConfirmation,
} from "./components/Notification";
import "./style.css";
import { getErrorFeedback } from "./util/error";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterEntry, setFilterEntry] = useState("");
  const [confirmationInfo, setConfirmationInfo] = useState({
    message: null,
    class: undefined,
  });

  useEffect(() => {
    personService.getAll().then((personsList) => {
      setPersons(personsList);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const personAlreadyExists = persons.some((person) => {
      const nameMatches = person.name === newName;

      if (nameMatches) personObject.id = person.id;

      return nameMatches;
    });

    if (personAlreadyExists) {
      const confirmNumberReplacement = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (!confirmNumberReplacement) return;

      personService
        .update(personObject)
        .then((updatedPerson) => {
          const updatedPersonsList = [...persons];
          const requiredIndex = persons.findIndex(
            (p) => p.id === updatedPerson.id
          );

          if (requiredIndex !== -1) {
            updatedPersonsList[requiredIndex] = updatedPerson;
            setPersons(updatedPersonsList);

            const confirmationData = {
              message: `Updated ${updatedPerson.name}'s number`,
              className: "success",
            };
            setTemporaryConfirmation(
              confirmationData,
              5000,
              setConfirmationInfo
            );
          }
        })
        .then(() => {
          setNewName("");
          setNewNumber("");
          setFilterEntry("");
        })
        .catch((error) => {
          let errorMessage = getErrorFeedback(error);

          const confirmationData = {
            message: errorMessage,
            className: "error",
          };
          console.error(errorMessage);
          setTemporaryConfirmation(confirmationData, 8000, setConfirmationInfo);
        });
    } else {
      personService
        .create(personObject)
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));

          const confirmationData = {
            message: `Added ${newPerson.name}.`,
            className: "success",
          };
          setTemporaryConfirmation(confirmationData, 5000, setConfirmationInfo);
        })
        .then(() => {
          setNewName("");
          setNewNumber("");
          setFilterEntry("");
        })
        .catch((reason) => {
          let errorMessage = getErrorFeedback(reason);

          setTemporaryConfirmation(
            {
              message: errorMessage,
              className: "error",
            },
            5000,
            setConfirmationInfo
          );
        });
    }
  };

  const removePerson = (personId) => {
    const personName = persons.find((p) => p.id === personId).name;

    const confirmDelete = window.confirm(`Delete ${personName}?`);
    if (!confirmDelete) return;

    personService
      .remove(personId)
      .then(() => {
        // data (unused parameter) comes empty at delete request
        setPersons(
          persons.filter((p) => {
            return p.id !== personId;
          })
        );

        const confirmationData = {
          message: `Removed ${personName} from phonebook.`,
          className: "success",
        };
        setTemporaryConfirmation(confirmationData, 5000, setConfirmationInfo);
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
      <Notification
        message={confirmationInfo.message}
        className={confirmationInfo.class}
      />

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
