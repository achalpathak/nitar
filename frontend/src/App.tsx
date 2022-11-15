import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Footer, Home, Login, Policy, Register,_404 } from "@pages";

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
	{
		path: "/footer",
		element: <Footer />,
	},
	{
		path: "/404",
		element: <_404 />,
	},
]);

const App = () => <RouterProvider router={router} />;

export default App;
