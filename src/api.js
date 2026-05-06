import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || ""; // when empty axios will use relative paths
const api = axios.create({
  baseURL: API_URL,
  // optionally set common headers/timeouts here
  // timeout: 10000,
});

export default api;