import axios from "axios";

const api = axios.create({
  baseURL: "https://securevault-osrq.onrender.com/api",
});

export default api;