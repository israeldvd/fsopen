import Country from "./Country";
import Weather from "./Weather";

const FeedbackSection = ({ isDataReady, matches, onShowClick }) => {
  let feedbackPart = <p>Too many matches, specify another filter phrasing</p>;

  if (!isDataReady) {
    return <section>Fetching the data...</section>;
  }

  if (!matches || matches.length === 0) {
    feedbackPart = <p>No country matches that input.</p>;
  } else if (matches.length === 1) {
    const country = matches[0];
    const officialName = country.name.official;
    const capitalName = country.capital[0];
    feedbackPart = (
      <>
        <h2>{officialName}</h2>
        <Country info={country}></Country>
        <h2>Weather in {capitalName}</h2>
        <Weather capitalName={capitalName} />
      </>
    );
  } else if (matches.length <= 10) {
    feedbackPart = (
      <ul>
        {matches.map((country) => {
          const commonName = country.name.common;
          const officialName = country.name.official;
          const isCommonEqualToOfficial = commonName === officialName;
          return (
            <li key={country.cca3}>
              <b>{`${commonName}`}</b>
              {isCommonEqualToOfficial ? "" : ` (${officialName})`}{" "}
              <button
                onClick={() => {
                  onShowClick(officialName);
                }}>
                show
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return <section>{feedbackPart}</section>;
};

export default FeedbackSection;
