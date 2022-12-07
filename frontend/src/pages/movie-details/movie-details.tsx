import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Modal, Typography } from "@mui/material";
import api, { Routes } from "@api";
import {
	IBanners,
	ICategories,
	ICategory,
	ICategoryItem,
	IEpisodesSet,
	ISuccess,
} from "@types";
import { AxiosError } from "axios";
import { EpisodeList, MovieList } from "@components/movies";
import { useAlert } from "@hooks";
import "./movie-details.scss";
import { PlayCircleOutlineOutlined } from "@mui/icons-material";
import { useAppSelector } from "@redux/hooks";
import Swal from "sweetalert2";
import Player from "@components/Player";

const MovieDetails = (props: any) => {
	const { slug } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const showAlert = useAlert();
	const user = useAppSelector((state) => state.user);

	const [movie, setMovie] = useState<ICategoryItem>();
	const [similarMovies, setSimilarMovies] = useState<ICategory>();

	const [showTrailer, setShowTrailer] = useState<boolean>(false);
	const [showMovie, setShowMovie] = useState<boolean>(false);

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
				const res = await api.get<ISuccess<ICategoryItem>>(
					`${Routes.MOVIES}/${slug}/`
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
						position: "relative",
						backgroundImage: {
							xs: `url(${movie?.poster_large_vertical_image})`,
							sm: `url(${movie?.poster_large_horizontal_image})`,
						},
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						backgroundPosition: {
							xs: "center center",
							sm: "top",
						},
						height: {
							md: "35rem",
							sm: "25rem",
							xs: "100vh",
						},
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Grid
						container
						display='flex'
						sx={{
							paddingLeft: {
								md: "10rem",
							},
							justifyContent: {
								xs: "center",
								md: "flex-start",
							},
						}}
					>
						<Grid
							item
							xs={11}
							sm={8}
							md={6}
							sx={{
								backgroundColor: "rgba(0,0,0,0.5)",
								maxHeight: "600px",
								maxWidth: "550px",
							}}
							p={4}
						>
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
									{movie?.director_name ? (
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
									) : null}
									{movie?.language ? (
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
									) : null}
								</Grid>
							</Grid>
							<Grid item xs={12} my={1}>
								{movie?.star_cast ? (
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
															<Typography
																key={sc_i}
															>
																{sc?.trim()}
															</Typography>
														</Grid>
													))}
											</Grid>
										</Grid>
									</Grid>
								) : null}
							</Grid>
							<Grid item xs={12} my={1}>
								<a
									style={{
										color: "var(--website-secondary-color)",
										cursor: "pointer",
									}}
									onClickCapture={(e) => {
										e.preventDefault();
										if (movie?.trailer_link) {
											console.log("Watching Trailer");
											setShowTrailer(true);
										} else {
											Swal.fire({
												title: "Trailer not available",
												text: "Please contact admin",
												icon: "warning",
												allowOutsideClick: () => true,
											});
										}
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
					<Box
						sx={{
							position: "absolute",
							transform: "translate(50%, -50%)",
						}}
					>
						<a
							href=''
							onClickCapture={(e) => {
								e.preventDefault();
								console.log("Playing");

								//Checking for membership
								if (movie) {
									if (movie?.membership_required === false) {
										//PLaying video for every user
										if (movie?.video_link) {
											// setPlaying(true);
											setShowMovie(true);
										} else {
											Swal.fire({
												title: "Video is not available",
												text: "Please contact admin",
												icon: "warning",
												allowOutsideClick: () => true,
											});
										}
									} else {
										if (
											Object.hasOwn(movie, "video_link")
										) {
											//Membership is available, video can be played
											if (movie?.video_link) {
												//Video link is available for members
												if (movie?.video_link) {
													// setPlaying(true);
													setShowMovie(true);
												} else {
													Swal.fire({
														title: "Video is not available",
														text: "Please contact admin",
														icon: "warning",
														allowOutsideClick: () =>
															true,
													});
												}
											} else {
												//Video is not available for members
												Swal.fire({
													title: "Video is not available",
													text: "Please contact admin",
													icon: "warning",
													allowOutsideClick: () =>
														true,
												});
											}
										} else {
											//video_link is not available, check if user is logged in or not
											if (user?.full_name) {
												Swal.fire({
													title: "Membership Required",
													text: "Please subscribe to continue",
													icon: "warning",
													showConfirmButton: true,
													showCancelButton: true,
													confirmButtonText:
														"Subscribe",
													cancelButtonText: "Cancel",
													allowOutsideClick: () =>
														true,
												}).then((res) => {
													if (res.isConfirmed) {
														navigate("/plans");
													}
												});
											} else {
												Swal.fire({
													title: "Login",
													text: "Please sign in to continue",
													icon: "warning",
													showConfirmButton: true,
													showCancelButton: true,
													confirmButtonText:
														"Sign in",
													cancelButtonText: "Cancel",
													allowOutsideClick: () =>
														true,
												}).then((res) => {
													if (res.isConfirmed) {
														navigate("/login");
													}
												});
											}
										}
									}
								}
							}}
						>
							<PlayCircleOutlineOutlined
								className='main-play-button'
								style={{
									height: 60,
									width: 60,
								}}
							/>
						</a>
					</Box>
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
			<Modal
				open={showTrailer}
				closeAfterTransition
				onClose={() => setShowTrailer(false)}
			>
				<Box width='100%' height='100%' className='d-center'>
					<Box
						sx={{
							width: "100%",
							height: "100%",
						}}
						className='d-center'
					>
						<Player
							url={movie?.trailer_link}
							name={movie?.name}
							description={movie?.description}
							closePlayer={() => setShowTrailer(false)}
						/>
					</Box>
				</Box>
			</Modal>
			<Modal
				open={showMovie}
				closeAfterTransition
				onClose={() => setShowMovie(false)}
			>
				<Box width='100%' height='100%' className='d-center'>
					<Box
						sx={{
							width: "100%",
							height: "100%",
						}}
						className='d-center'
					>
						<Player
							url={movie?.video_link}
							name={movie?.name ?? ""}
							description={movie?.description ?? ""}
							closePlayer={() => setShowMovie(false)}
						/>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default MovieDetails;
