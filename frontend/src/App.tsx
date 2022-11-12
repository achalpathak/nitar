import { useState } from "react";
import reactLogo from "./assets/react.svg";
// import "./App.scss";
import Login from "./pages/login";
import Home from "./pages/home";

function App() {
	const [count, setCount] = useState(0);

	if (window.location.pathname === "/") {
		window.location.href = "/register";
	}

	if (
		window.location.pathname === "/login" ||
		window.location.pathname === "/register"
	) {
		return <Login />;
	} else {
		return <Home />;
	}
}

export default App;
