import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.environment === "development"
      ? process.env.SERVER_URL_DEV
      : process.env.SERVER_URL_PROD,
});

export default instance;
