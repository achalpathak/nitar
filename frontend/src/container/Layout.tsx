import { FC, lazy, Suspense, useLayoutEffect } from "react";
import { AppBar, Loader } from "@components";
import { Route, Routes, useLocation } from "react-router-dom";
import {
	Home,
	Policy,
	Footer,
	Plans,
	ContactUs,
	Upcoming,
	MovieDetails,
} from "@pages";
import SeriesDetails from "@pages/series-details";

const Wrapper = ({ children }: any) => {
	const location = useLocation();
	useLayoutEffect(() => {
		document.documentElement.scrollTo(0, 0);
	}, [location.pathname]);
	return children;
};

const TheContent = () => {
	return (
		<div
			style={{
				display: "flex",
				flex: 1,
				flexDirection: "column",
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
							<Route path='/plans' element={<Plans />} />
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
