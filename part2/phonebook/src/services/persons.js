import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const index = () => {
  return axios.get(baseUrl);
};

const create = (person) => {
  return axios.post(baseUrl, person);
};

const update = (id, person) => {
  return axios.put(`${baseUrl}/${id}`, person);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { index, create, update, remove };
