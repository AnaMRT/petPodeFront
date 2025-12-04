import axios from "axios";

const api = axios.create({
  baseURL: "https://petpodeback.onrender.com",

  ///https://petpodeback.onrender.com
  ///http://10.0.6.21:8080
});

export default api;