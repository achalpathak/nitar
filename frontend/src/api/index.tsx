import axios from "axios";

const api = axios.create({
	baseURL: "/backend",
	withCredentials: true,
	xsrfCookieName: "csrftoken",
	xsrfHeaderName: "x-csrftoken",
});

export { Routes } from "./Routes";

export default api;
