import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./movie-details.scss";

const MovieDetails = (props) => {
	const { slug } = useParams();

	return (
		<>
			<div>Movie Details = {slug}</div>
		</>
	);
};

export default MovieDetails;
