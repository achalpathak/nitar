import { lazy, Suspense } from "react";
import { AppBar, Loader } from "@components";
import { Route, Routes } from "react-router-dom";
import {
	Home,
	Policy,
	Footer,
	Plans,
	ContactUs,
	Upcoming,
	MovieDetails,
} from "@pages";

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
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/upcoming' element={<Upcoming />} />
						<Route path='/movie/:slug' element={<MovieDetails />} />
						<Route path='/plans' element={<Plans />} />
						<Route path='/contact-us' element={<ContactUs />} />
						<Route
							path='/terms-and-conditions'
							element={<Policy />}
						/>
						<Route path='/contact-us' element={<Policy />} />
						<Route path='/privacy-policy' element={<Policy />} />
						<Route path='/refund-policy' element={<Policy />} />
					</Routes>
				</Suspense>
			</main>
			<footer>
				<Footer />
			</footer>
		</div>
	);
};

export default TheContent;
