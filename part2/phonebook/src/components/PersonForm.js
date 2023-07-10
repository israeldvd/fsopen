import "./Form.css";

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

export default PersonForm;
