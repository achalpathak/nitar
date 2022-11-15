import axios from "axios";

const api = axios.create({
	baseURL: "backend",
});

export { Routes } from "./Routes";

export default api;
