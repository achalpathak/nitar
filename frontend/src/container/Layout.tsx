import { Suspense, useLayoutEffect } from "react";
import { AppBar, Loader } from "@components";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
	Home,
	Policy,
	Footer,
	Plans,
	ContactUs,
	Upcoming,
	MovieDetails,
	ExtrasDetails,
} from "@pages";
import SeriesDetails from "@pages/series-details";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { IPreferences, ISuccess, IUser } from "@types";
import Actions from "@redux/actions";
import api from "@api";
import { Routes as ApiRoutes } from "@api";

const Wrapper = ({ children }: any) => {
	const location = useLocation();
	useLayoutEffect(() => {
		document.documentElement.scrollTo(0, 0);
	}, [location.pathname]);
	return children;
};

const TheContent = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const payment = useAppSelector((state) => state.payment);
	const user = useAppSelector((state) => state.user);

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

	const getWebsiteConfig = async () => {
		try {
			const res = await api.get<ISuccess<IPrefs[]>>(
				ApiRoutes.WEBSITE_CONFIG
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
	};

	const getUserInfo = async () => {
		try {
			const res = await api.get<ISuccess<IUser>>(ApiRoutes.GET_USER_INFO);

			if (res.status === 200) {
				dispatch({
					type: Actions.LOGIN,
					payload: res.data?.result,
				});
			}
		} catch (error) {
			const err = error as AxiosError<ISuccess>;
			console.error(err?.response);
			if (user?.email) {
				//Session Expired
				Swal.fire({
					title: "Session Expired",
					text: "Please login again! Page will redirect to home in 5 seconds",
					icon: "warning",
				});
				setTimeout(() => {
					dispatch({
						type: Actions.LOGOUT,
					});
					navigate("/");
					Swal.close();
				}, 5000);
			}
		}
	};

	useLayoutEffect(() => {
		getUserInfo();
		getWebsiteConfig();
	}, [location]);

	return (
		<div
			style={{
				display: "flex",
				flex: 1,
				flexDirection: "column",
				minHeight: "100vh",
				justifyContent: "space-between",
			}}
		>
			<header>
				<AppBar />
			</header>
			<main>
				<Suspense fallback={<Loader />}>
					<Wrapper>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/upcoming' element={<Upcoming />} />
							<Route
								path='/movies/:slug'
								element={<MovieDetails />}
							/>
							<Route
								path='/series/:slug'
								element={<SeriesDetails />}
							/>
							<Route
								path='/extras/:slug'
								element={<ExtrasDetails />}
							/>
							{!payment?.status ? (
								<Route path='/plans' element={<Plans />} />
							) : null}
							<Route path='/contact-us' element={<ContactUs />} />
							<Route
								path='/terms-and-conditions'
								element={<Policy />}
							/>
							<Route path='/contact-us' element={<Policy />} />
							<Route
								path='/privacy-policy'
								element={<Policy />}
							/>
							<Route path='/refund-policy' element={<Policy />} />
						</Routes>
					</Wrapper>
				</Suspense>
			</main>
			<footer>
				<Footer />
			</footer>
		</div>
	);
};

export default TheContent;
