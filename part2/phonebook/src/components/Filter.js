const Filter = ({ filterEntry, onWriteFilter }) => {
  return (
    <>
      filter shown with{" "}
      <input value={filterEntry} onChange={onWriteFilter}></input>
    </>
  );
};

export default Filter;
