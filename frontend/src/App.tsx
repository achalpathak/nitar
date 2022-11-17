import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login, Register, Footer, _404 } from "@pages";
import { Layout } from "@container";

const router = createBrowserRouter([
	{
		path: "/*",
		element: <Layout />,
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
