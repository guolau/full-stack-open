import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const index = () => {
  return axios.get(`${baseUrl}/all`);
};

export default { index };
