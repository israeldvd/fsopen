const Persons = ({ personsList }) => {
  return (
    <>
      <h2>Numbers</h2>
      <ul>
        {personsList.map((person) => (
          <li key={person.name}>
            <p>
              {person.name} {person.phone}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
