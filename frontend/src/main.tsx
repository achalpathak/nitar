import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@sweetalert2/theme-dark/dark.scss";
import "./index.scss";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@redux/store";

const root = document.getElementById("root");

//Remove console.log in other environments
if (import.meta.env.MODE !== "development") {
	console.log = () => {};
}

ReactDOM.createRoot(root as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
