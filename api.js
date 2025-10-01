import axios from "axios";

const api = axios.create({
  baseURL: "http:/10.0.6.22:8080",

});

export default api;
