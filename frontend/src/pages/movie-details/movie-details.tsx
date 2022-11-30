import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import api, { Routes } from "@api";
import {
	IBanners,
	ICategories,
	ICategory,
	ICategoryItem,
	ISuccess,
} from "@types";
import { AxiosError } from "axios";
import MovieList from "@components/movies";
import { useAlert } from "@hooks";
import "./movie-details.scss";
import { PlayCircleOutlineOutlined } from "@mui/icons-material";

const MovieDetails = (props: any) => {
	const { slug } = useParams();
	const location = useLocation();

	const showAlert = useAlert();

	const [movie, setMovie] = useState<ICategoryItem>();
	const [similarMovies, setSimilarMovies] = useState<ICategory>();

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<ICategories>>(
					Routes.HOME_PAGE_LISTINGS
				);

				if (res.status === 200) {
					setSimilarMovies(
						res.data?.result?.categories?.find(
							(v) => v.name?.toLowerCase() === "trending now"
						)
					);
					console.log("Movies", res.data?.result);
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err?.response);
				showAlert("error", "Error", err?.response?.data?.message);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const isMovies = location?.pathname?.startsWith("/movies");

				const res = await api.get<ISuccess<ICategoryItem>>(
					`${isMovies ? Routes.MOVIES : Routes.SERIES}/${slug}/`
				);

				if (res.status === 200) {
					setMovie(res.data?.result);
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err.response);
			}
		})();
	}, []);

	return (
		<>
			<Grid container className='movie-details'>
				<Grid
					item
					xs={12}
					sx={{
						backgroundImage: `url(${movie?.poster_large_horizontal_image})`,
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						height: "100vh",
					}}
					className='d-center'
				>
					<Grid
						container
						sx={{
							paddingLeft: "10rem",
						}}
					>
						<Grid
							item
							xs={12}
							md={4}
							sx={{
								backgroundColor: "rgba(0,0,0,0.5)",
								height: "600px",
								width: "550px",
							}}
							p={4}
						>
							<Grid item xs={12}>
								<Typography
									fontFamily='Barlow Condensed'
									fontSize={25}
								>
									Gullar Original
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography
									fontFamily='Playfair Display'
									fontSize={40}
								>
									{movie?.name}
								</Typography>
							</Grid>
							<Grid item xs={12} my={1}>
								<Typography fontFamily='inter' fontSize={16}>
									{movie?.description}
								</Typography>
							</Grid>
							<Grid item xs={12} my={1}>
								<Box display='flex'>
									<Box
										mr={2}
										className='genre'
										sx={{
											backgroundColor: "black",
										}}
										p={1}
									>
										<Typography
											fontFamily='Barlow Condensed'
											fontSize={16}
										>
											{movie?.age_rating}
										</Typography>
									</Box>
									{movie?.get_genres?.map((g, i) => (
										<Box
											key={g}
											mr={2}
											className='genre'
											sx={{
												backgroundColor: "black",
											}}
											p={1}
										>
											<Typography
												fontFamily='Barlow Condensed'
												fontSize={16}
											>
												{g}
											</Typography>
										</Box>
									))}
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Grid container>
									<Grid item xs={4}>
										<Box
											display='flex'
											flexDirection='column'
										>
											<Typography
												variant='h5'
												fontFamily='Barlow Condensed'
											>
												Director
											</Typography>
											<Typography>
												{movie?.director_name ?? ""}
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={4}>
										<Box
											display='flex'
											flexDirection='column'
										>
											<Typography
												variant='h5'
												fontFamily='Barlow Condensed'
											>
												Production
											</Typography>
											<Typography>
												{movie?.director_name ?? ""}
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={4}>
										<Box
											display='flex'
											flexDirection='column'
										>
											<Typography
												variant='h5'
												fontFamily='Barlow Condensed'
											>
												Language
											</Typography>
											<Typography>
												{movie?.language ?? ""}
											</Typography>
										</Box>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} my={1}>
								<Grid container>
									<Typography
										variant='h5'
										fontFamily='Barlow Condensed'
										mb={1}
									>
										Star Cast
									</Typography>
									<Grid item xs={12}>
										<Grid container>
											{movie?.star_cast
												?.split(",")
												?.map((sc, sc_i) => (
													<Grid item xs={6}>
														<Typography key={sc_i}>
															{sc?.trim()}
														</Typography>
													</Grid>
												))}
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} my={1}>
								<a
									style={{
										color: "white",
										cursor: "pointer",
									}}
									onClickCapture={(e) => {
										e.preventDefault();
										console.log("Watching Trailer");
									}}
								>
									<Grid container>
										<Grid item mr={1}>
											<PlayCircleOutlineOutlined />
										</Grid>
										<Grid item>
											<Typography fontFamily='Barlow Condensed'>
												Watch Trailer
											</Typography>
										</Grid>
									</Grid>
								</a>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					{similarMovies ? (
						<MovieList
							{...similarMovies}
							name='Similar Like This'
						/>
					) : null}
				</Grid>
			</Grid>
			<PlayCircleOutlineOutlined className='main-play-button' />
		</>
	);
};

export default MovieDetails;
