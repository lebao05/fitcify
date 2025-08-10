import axios from "axios";
const API_BASE_URL = "https://fitcify.onrender.com";
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
