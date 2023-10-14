import "./Form.css";
import PropTypes from "prop-types";

const PersonForm = ({
  newName,
  newNumber,
  onAddPerson,
  onTypeName,
  onTypePhoneNumber,
}) => {
  return (
    <>
      <form onSubmit={onAddPerson}>
        <div>
          name: <input value={newName} onChange={onTypeName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={onTypePhoneNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

PersonForm.propTypes = {
  newName: PropTypes.string,
  newNumber: PropTypes.string,
  onAddPerson: PropTypes.func.isRequired,
  onTypeName: PropTypes.func.isRequired,
  onTypePhoneNumber: PropTypes.func.isRequired,
};

export default PersonForm;
