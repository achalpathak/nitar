import { Banner, DownloadApp, SubscribeButton } from "@components";
import MovieList from "@components/movies";
import MovieTile from "@assets/home/movie-tile.png";

const movies = [
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
	{
		title: "Undone",
		image: MovieTile,
	},
];

const Home = () => {
	return (
		<div
			style={{
				display: "flex",
				flex: 1,
				flexDirection: "column",
			}}
		>
			<Banner />
			<DownloadApp />
			<MovieList title='Popular Originals' items={movies} />
			<MovieList title='Trending Now' items={movies} />
			<SubscribeButton />
			<MovieList title='Most Watched' items={movies} />
			<MovieList title='Web Series' items={movies} />
		</div>
	);
};

export default Home;
