import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";
const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, //
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
