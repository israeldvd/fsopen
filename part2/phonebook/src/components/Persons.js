const Persons = ({ personsList, remove }) => {
  return (
    <>
      <ul>
        {personsList.map((person) => (
          <li key={person.name}>
            <p>
              {person.name} {person.number}
              <button
                onClick={() => {
                  remove(person.id);
                }}>
                remove
              </button>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
