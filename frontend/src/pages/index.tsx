import { lazy } from "react";

const Login = lazy(() => import("@pages/login"));
const Register = lazy(() => import("@pages/register"));
const Home = lazy(() => import("@pages/home"));
const Policy = lazy(() => import("@pages/miscellaneous/Policy"));
const Footer = lazy(() => import("@pages/miscellaneous/Footer"));
const _404 = lazy(() => import("@pages/miscellaneous/_404"));
const Plans = lazy(() => import("@pages/plans"));
const ContactUs = lazy(() => import("@pages/contact-us"));
const Upcoming = lazy(() => import("@pages/upcoming"));
const MovieDetails = lazy(() => import("@pages/movie-details"));
const SeriesDetails = lazy(() => import("@pages/series-details"));
const ExtrasDetails = lazy(() => import("@pages/extras-details"));

export {
	Login,
	Register,
	Home,
	Policy,
	Footer,
	_404,
	Plans,
	ContactUs,
	Upcoming,
	MovieDetails,
	ExtrasDetails,
};
