import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import {
	createBrowserRouter,
	Link,
	RouterProvider,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { Layout } from "@container";
import { Alert, Loader } from "@components";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import api, { Routes } from "@api";
import {
	IBanners,
	IPreferences,
	IPrefs,
	ISuccess,
	IUser,
	IWelcomeBanner,
} from "@types";
import { AxiosError } from "axios";
import Actions from "@redux/actions";
import "react-carousel-animated/dist/style.css";
import { UnauthenticatedRoute } from "@router";
import Constants from "@constants";
import { useAlert } from "@hooks";
import Swal from "sweetalert2";

const Login = lazy(() => import("@pages/login"));
const Register = lazy(() => import("@pages/register"));
const ResetPassword = lazy(() => import("@pages/reset-password"));
const _404 = lazy(() => import("@pages/miscellaneous/_404"));

const router = createBrowserRouter([
	{
		path: "/*",
		element: <Layout />,
	},
	{
		path: "/login",
		element: (
			<UnauthenticatedRoute>
				<Login />
			</UnauthenticatedRoute>
		),
	},
	{
		path: "/register",
		element: (
			<UnauthenticatedRoute>
				<Register />
			</UnauthenticatedRoute>
		),
	},
	{
		path: "/404",
		element: <_404 />,
	},
]);

const App = () => {
	const dispatch = useAppDispatch();

	const loading = useAppSelector((state) => state.loading);

	const [welcomeBanner, setWelcomeBanner] = useState<IWelcomeBanner>();

	const hexToRgb = (hex: string | undefined) => {
		let c: any;
		if (hex && /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			c = hex.substring(1).split("");
			if (c.length == 3) {
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = "0x" + c.join("");
			return (
				"rgb(" +
				[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
				")"
			);
		}
		return "";
	};

	useEffect(() => {
		api.interceptors.request.use(
			(config) => {
				if (
					Constants.WHITELIST_URLS.filter((url) =>
						config.url?.toString()?.includes(url?.toString())
					).length === 0 &&
					loading !== true
				) {
					dispatch({ type: Actions.SET_LOADING });
				}

				return config;
			},
			(error) => {
				const e = error as AxiosError<ISuccess>;
				return Promise.reject(e);
			}
		);

		api.interceptors.response.use(
			(response) => {
				dispatch({ type: Actions.REMOVE_LOADING });
				return response;
			},
			(error) => {
				dispatch({ type: Actions.REMOVE_LOADING });
				const e = error as AxiosError<ISuccess>;
				return Promise.reject(e);
			}
		);
	}, []);

	const setCSSVariables = (prefs: IPreferences) => {
		const htmlElement = document.documentElement;
		const favicon = document.head.querySelector(
			"#favicon"
		) as HTMLLinkElement;
		const title = document.head.querySelector("title") as HTMLTitleElement;

		htmlElement.style.setProperty(
			"--website-primary-color",
			prefs?.color_primary?.value ?? ""
		);

		htmlElement.style.setProperty(
			"--website-secondary-color",

			prefs?.color_secondary?.value ?? ""
		);

		htmlElement.style.setProperty(
			"--website-alternate-color",

			prefs?.color_alternate?.value ?? ""
		);

		//Setting Favicon
		favicon.href = `${prefs?.logo_url?.image ?? ""}`;

		//Setting Title of App
		title.innerText = prefs?.name_of_the_app?.value ?? "";
	};

	useLayoutEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<IPrefs[]>>(
					Routes.WEBSITE_CONFIG
				);

				const prefsObj: IPreferences = res.data?.result
					.map((v) => ({ [v.field]: v }))
					.reduce((c, acc) => ({ ...acc, ...c }));

				setCSSVariables(prefsObj);

				if (res.status === 200) {
					dispatch({
						type: Actions.SAVE_PREFERENCES,
						payload: prefsObj,
					});
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err.response);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<IBanners>>(Routes.BANNER);

				if (res.status === 200) {
					const banner = res.data?.result?.welcome_banner;

					if (banner?.length > 0) {
						setWelcomeBanner(banner?.[0]);
					}
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err.response);
			}
		})();
	}, []);

	// useEffect(() => {
	// 	if (welcomeBanner) {
	// 		setTimeout(() => {
	// 			setOpen(true);
	// 		}, 2000);
	// 	}
	// }, [welcomeBanner]);

	return (
		<Suspense fallback={<Loader />}>
			<RouterProvider router={router} />
			{loading ? <Loader /> : null}
			<Alert />
			{/* {welcomeBanner && ? (
				<Modal
					closeAfterTransition
					open={isOpen}
					onClose={() => setOpen(false)}
					className='d-center'
				>
					<Box
						style={{
							height: "100%",
							width: "100%",
						}}
					>
						<Box
							style={{
								width: "80vw",
								height: "80vh",
								backdropFilter: "brightness(0.5)",
								position: "relative",
							}}
						>
							<Link
								to={`${
									welcomeBanner?.url_type === "EXTERNAL"
										? welcomeBanner?.url
										: `/${welcomeBanner?.content_type?.toLowerCase()}/${
												welcomeBanner?.url
										  }`
								}`}
								target={
									welcomeBanner?.url_type === "EXTERNAL"
										? "_blank"
										: "_self"
								}
							>
								<picture>
									<img
										src={`${welcomeBanner?.website_banner}`}
										style={{
											height: "100%",
											width: "100%",
											objectFit: "contain",
											borderRadius: 20,
										}}
									/>
								</picture>
							</Link>
							<a
								href=''
								onClickCapture={(e) => {
									e.preventDefault();
									setOpen(false);
								}}
							>
								<Close
									height={80}
									style={{
										color: "var(--website-primary-color)",
										position: "absolute",
										top: 0,
										right: 0,
									}}
								/>
							</a>
						</Box>
					</Box>
				</Modal>
			) : null} */}
		</Suspense>
	);
};

export default App;
