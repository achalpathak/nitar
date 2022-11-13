import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Login, Register } from "@pages";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
]);

const App = () => <RouterProvider router={router} />;

export default App;
