const Filter = ({ filterEntry, setFilterEntry }) => {
  return (
    <>
      <h2>Filter</h2>
      filter shown with{" "}
      <input
        value={filterEntry}
        onChange={(e) => {
          setFilterEntry(e.target.value);
        }}></input>
    </>
  );
};

export default Filter;
