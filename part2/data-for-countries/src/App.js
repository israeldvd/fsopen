import { useEffect, useState } from "react";
import countryService from "./services/countries";
import FeedbackSection from "./components/FeedbackSection";

const isTrimmedTextEmpty = (text) => {
  return text.trim() === "";
};

const App = () => {
  const [allCountries, setAllCountries] = useState(null);
  const [countryFilter, setCountryFilter] = useState("");
  const [matchingCountries, setMatchingCountries] = useState(null);

  useEffect(() => {
    countryService.getAll().then((response) => {
      setAllCountries(response);
      setMatchingCountries(response);
      return response;
    });
  }, []);

  useEffect(() => {
    if (!allCountries || isTrimmedTextEmpty(countryFilter)) {
      if (countryFilter !== "") {
        console.warn(
          "The input filter is being used when no data is yet fetched correctly."
        );
      }
      return null;
    }

    const newMatchingCountries = allCountries.filter(
      (count) =>
        count.name.common.toUpperCase().includes(countryFilter.toUpperCase()) ||
        count.name.official.toUpperCase().includes(countryFilter.toUpperCase())
    );

    setMatchingCountries(newMatchingCountries);
  }, [allCountries, countryFilter]);

  return (
    <main>
      <section>
        <p>
          find countries{" "}
          <input
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
            }}
          />
        </p>
      </section>
      <FeedbackSection
        matches={matchingCountries}
        isDataReady={!!allCountries}
      />
    </main>
  );
};

export default App;
