const flagStyle = {
  maxWidth: 250,
};

const Country = ({ info }) => {
  const capital = info.capital[0];
  const area = info.area;
  const flagSvgSrc = info.flags["svg"];
  const flagAlt = info.flags["alt"];
  const languagesList = Object.entries(info.languages);
  return (
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
  );
};

export default Country;
