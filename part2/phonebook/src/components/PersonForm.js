const PersonForm = ({
  addPerson,
  newName,
  setNewName,
  newPhone,
  setNewPhone,
}) => {
  return (
    <>
      <h2>Add a new</h2>
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
    </>
  );
};

export default PersonForm;
