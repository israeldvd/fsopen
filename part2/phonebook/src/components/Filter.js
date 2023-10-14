import PropTypes from "prop-types";

const Filter = ({ filterEntry, onWriteFilter }) => {
  return (
    <>
      filter shown with{" "}
      <input value={filterEntry} onChange={onWriteFilter}></input>
    </>
  );
};

Filter.propTypes = {
  filterEntry: PropTypes.string.isRequired,
  onWriteFilter: PropTypes.func.isRequired,
};

export default Filter;
