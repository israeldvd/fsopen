const Filter = ({ filterEntry, setFilterEntry }) => {
  return (
    <>
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
