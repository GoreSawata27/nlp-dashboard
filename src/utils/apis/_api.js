import axios from "axios";
import { jwtDecode } from "jwt-decode";

const _api = axios.create({
  baseURL: "https://triec-uatapi.dtskill.com",
});

// Add a request interceptor to include the JWT token in the headers
_api.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem("access-token");
    if (!token) {
      if (window.location.pathname !== "/unauthorized") {
        window.location.href = "/unauthorized";
      }
      return Promise.reject("No token in local storage");
    }

    // Decode the JWT token to check its expiration
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      window.location.href = "/unauthorized";

      return Promise.reject("Your session has expired. Please log in again to continue.");
    }

    config.headers.Authorization = `${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default _api;
