import PropTypes from "prop-types";

const Persons = ({ personsList, remove }) => {
  return (
    <>
      <ul>
        {personsList.map((person) => (
          <li key={person.name}>
            <p>
              {person.name} {person.number}{" "}
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

Persons.propTypes = {
  personsList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ),
  remove: PropTypes.func.isRequired,
};

export default Persons;
