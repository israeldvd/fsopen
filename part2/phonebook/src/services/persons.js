import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseUrl);

  return request.then((response) => response.data);
};

const create = (person) => {
  const request = axios.post(baseUrl, person);

  return request.then((response) => response.data);
};

const update = (updatedPersonObject) => {
  const id = updatedPersonObject.id;
  const request = axios.patch(`${baseUrl}/${id}`, updatedPersonObject);

  return request.then((response) => {
    return response.data;
  });
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => {
    return response.data;
  });
};

const exportedMethods = {
  getAll,
  create,
  update,
  remove,
};

export default exportedMethods;
