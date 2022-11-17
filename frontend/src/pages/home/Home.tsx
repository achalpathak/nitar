import { AppBar, Banner, SubscribeButton } from "@components";
import { Box, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import MovieList from "@components/movies";
import downloadApp from "@assets/home/downloadApp.png";

const movies = [
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
	},
	{
		title: "Undone",
		image: "src/assets/home/movie-tile.png",
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
            <div className='download-app-container'>
						<img
							alt='Download App'
							src={downloadApp}
							width='50%'
							// height='100%'
						></img>
					</div>
			<MovieList title='Popular Originals' items={movies} />
			<MovieList title='Trending Now' items={movies} />
            <SubscribeButton/>
			<MovieList title='Most Watched' items={movies} />
			<MovieList title='Web Series' items={movies} />
		</div>
	);
};

export default Home;
