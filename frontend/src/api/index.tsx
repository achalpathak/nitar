import axios from "axios";

// const BASE_URL = "http://localhost:8000";
const BASE_URL = "backend";

const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	xsrfCookieName: "csrftoken",
	xsrfHeaderName: "x-csrftoken",
});

export { Routes } from "./Routes";
export { BASE_URL };

export default api;
