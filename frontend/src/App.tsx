import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Login, Policy, Register } from "@pages";

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
	{
		path: "/terms-and-conditions",
		element: <Policy />,
	},
	{
		path: "/contact-us",
		element: <Policy />,
	},
	{
		path: "/privacy-policy",
		element: <Policy />,
	},
]);

const App = () => <RouterProvider router={router} />;

export default App;
