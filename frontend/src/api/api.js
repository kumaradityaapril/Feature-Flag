import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://feature-flag-40we.onrender.com",
});

export default API;