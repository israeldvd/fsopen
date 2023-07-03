const Persons = ({ personsList }) => {
  return (
    <>
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
