import axios from "axios";

const api = axios.create({
	baseURL: "backend",
});

export default api;
