import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    console.log('DEBUG - Axios - Sending token for:', user ? JSON.parse(user).email : 'NO USER', 'Token:', token ? 'Bearer ' + token.substring(0, 20) + '...' : 'NO TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;