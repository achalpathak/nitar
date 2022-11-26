import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@container";
import { Alert, Loader } from "@components";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import api, { Routes } from "@api";
import { IPreferences, ISuccess } from "@types";
import { AxiosError } from "axios";
import Actions from "@redux/actions";
import "react-carousel-animated/dist/style.css";

const Login = lazy(() => import("@pages/login"));
const Register = lazy(() => import("@pages/register"));
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
		path: "/404",
		element: <_404 />,
	},
]);

const App = () => {
	const dispatch = useAppDispatch();

	const preferences = useAppSelector((state) => state.preferences);

	useEffect(() => {
		(async () => {
			try {
				if (preferences?.length === 0) {
					const res = await api.get<ISuccess<IPreferences[]>>(
						Routes.WEBSITE_CONFIG
					);

					if (res.status === 200) {
						dispatch({
							type: Actions.SAVE_PREFERENCES,
							payload: res.data?.result,
						});
					}
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err.response);
			}
		})();
	}, []);

	return (
		<Suspense fallback={<Loader />}>
			<RouterProvider router={router} />
			{false ? <Loader /> : null}
			<Alert />
		</Suspense>
	);
};

export default App;
