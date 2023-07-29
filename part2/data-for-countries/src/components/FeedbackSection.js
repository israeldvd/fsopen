import Weather from "./Weather";

const flagStyle = {
  maxWidth: 250,
};

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
    const capital = country.capital[0];
    const area = country.area;
    const flagSvgSrc = country.flags["svg"];
    const flagAlt = country.flags["alt"];
    const languagesList = Object.entries(country.languages);
    feedbackPart = (
      <>
        <h2>{officialName}</h2>
        <section>
          <ul>
            <li>capital: {capital}</li>
            <li>area: {area}</li>
            <li>
              <b>languages</b>:
              <ul>
                {languagesList.map(([id, description]) => {
                  return <li key={id}>{description}</li>;
                })}
              </ul>
            </li>
          </ul>
          <img style={flagStyle} src={flagSvgSrc} alt={flagAlt}></img>
        </section>
        <h2>Weather in {country.capital[0]}</h2>
        <Weather capitalName={country.capital[0]} />
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
