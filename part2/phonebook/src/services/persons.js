import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const index = () => {
  return axios.get(baseUrl);
};

const create = (person) => {
  return axios.post(baseUrl, person);
};

const update = (id, person) => {
  return axios.put(`${baseUrl}/${id}`, person);
};

export default { index, create, update };
