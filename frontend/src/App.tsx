import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@container";
import { Alert, Loader } from "@components";
import { lazy, Suspense } from "react";
import "react-carousel-animated/dist/style.css";

const Login = lazy(() => import("@pages/login"));
const Register = lazy(() => import("@pages/register"));
const Footer = lazy(() => import("@pages/miscellaneous/Footer"));
const _404 = lazy(() => import("@pages/miscellaneous/_404"));

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

const App = () => {
	// useLayoutEffect(() => {
	//     const loader = document.getElementById("loader")!;
	//     setTimeout(() => {
	//       loader.classList.add("loaded");
	//       setTimeout(() => {
	//         document.body.removeChild(loader);
	//       }, 300);
	//     }, 2000);
	// },[]);

	return (
		<Suspense fallback={<Loader />}>
			<RouterProvider router={router} />
			{false ? <Loader /> : null}
			<Alert />
		</Suspense>
	);
};

export default App;
