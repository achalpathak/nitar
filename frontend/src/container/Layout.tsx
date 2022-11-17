import { AppBar } from "@components";
import { ContactUs, Home, Subscribe, Upcoming } from "@pages";
import Footer from "@pages/miscellaneous/Footer";
import Policy from "@pages/miscellaneous/Policy";
import {
	createBrowserRouter,
	Route,
	RouterProvider,
	Routes,
} from "react-router-dom";

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
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/upcoming' element={<Upcoming />} />
					<Route path='/subscribe' element={<Subscribe />} />
					<Route path='/contact-us' element={<ContactUs />} />
					<Route path='/terms-and-conditions' element={<Policy />} />
					<Route path='/contact-us' element={<Policy />} />
					<Route path='/privacy-policy' element={<Policy />} />
				</Routes>
			</main>
			<footer>
				<Footer />
			</footer>
		</div>
	);
};

export default TheContent;
