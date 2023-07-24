const flagStyle = {
  maxWidth: 250,
};

const FeedbackSection = ({ isDataReady, matches }) => {
  let feedbackPart = <p>Too many matches, specify another filter phrasing</p>;

  if (!isDataReady) {
    return <section>Fetching the data...</section>;
  }

  if (!matches || matches.length === 0) {
    feedbackPart = <p>No country matches that input.</p>;
  } else if (matches.length === 1) {
    const country = matches[0];
    const flagSvgSrc = country.flags["svg"];
    const flagAlt = country.flags["alt"];
    const languagesList = Object.entries(country.languages);
    feedbackPart = (
      <>
        <h2>{country.name.official}</h2>
        <ul>
          <li>capital: {country.capital[0]}</li>
          <li>area: {country.area}</li>
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
      </>
    );
  } else if (matches.length <= 10) {
    feedbackPart = (
      <ul>
        {matches.map((country) => (
          <li key={country.cca3}>
            <b>{country.name.common}</b> ({country.name.official})
          </li>
        ))}
      </ul>
    );
  }

  return <section>{feedbackPart}</section>;
};

export default FeedbackSection;
