import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = () => {
  const countries = axios.get(`${baseUrl}/all`).then((data) => data);
  return countries.then((response) => response.data);
};

const getCoutriesByFilter = (filter) => {
  const countries = axios.get(`${baseUrl}/name/${filter}`).then((data) => {
    return data;
  });

  return countries.then((response) => response.data);
};

const exportFunctions = {
  getAll,
  getCoutriesByFilter,
};

export default exportFunctions;
