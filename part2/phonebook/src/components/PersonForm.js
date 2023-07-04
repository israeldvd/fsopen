const PersonForm = ({
  newName,
  newPhone,
  onAddPerson,
  onTypeName,
  onTypePhone,
}) => {
  return (
    <>
      <form onSubmit={onAddPerson}>
        <div>
          name: <input value={newName} onChange={onTypeName} />
        </div>
        <div>
          number: <input value={newPhone} onChange={onTypePhone} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
