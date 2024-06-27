import axios from "axios";

const instance = axios.create({
  baseURL:
   "https://crud-app-backend-kj06.onrender.com"
});

export default instance;
