import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Modal, Typography } from "@mui/material";
import api, { BASE_URL, Routes } from "@api";
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
import ReactPlayer from "react-player";
import { useAppSelector } from "@redux/hooks";
import Swal from "sweetalert2";

const MovieDetails = (props: any) => {
	const { slug } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const showAlert = useAlert();
	const user = useAppSelector((state) => state.user);

	const [movie, setMovie] = useState<ICategoryItem>();
	const [similarMovies, setSimilarMovies] = useState<ICategory>();

	const [showTrailer, setShowTrailer] = useState<boolean>(false);
	const [isPlaying, setPlaying] = useState<boolean>(false);

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
						backgroundImage: !isPlaying
							? `url(${movie?.poster_large_horizontal_image})`
							: "none",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						height: {
							md: "100vh",
							xs: !isPlaying ? "100vh" : "15rem",
						},
						display: "flex",
						flexDirection: "column",
						alignItems: {
							xs: "center",
							md: !isPlaying ? "center" : "flex-start",
						},
						justifyContent: {
							xs: "center",
							md: !isPlaying ? "center" : "flex-start",
						},
					}}
				>
					{isPlaying ? (
						<>
							<Box
								sx={{
									width: "100%",
									height: {
										xs: "100%",
										md: "90%",
									},
								}}
							>
								{(movie?.video_link ?? "") !== "" ? (
									<ReactPlayer
										controls
										url={`${movie?.video_link}`}
										width='100%'
										height='100%'
										onReady={(e) => {
											console.log("Player ready", e);
										}}
									/>
								) : null}
							</Box>
							<Box m={2}>
								<Typography fontFamily='inter' fontSize={25}>
									{movie?.name}
								</Typography>
							</Box>
						</>
					) : (
						<Grid
							container
							sx={{
								paddingLeft: {
									md: "10rem",
								},
							}}
						>
							<Grid
								item
								xs={12}
								md={4}
								sx={{
									backgroundColor: "rgba(0,0,0,0.5)",
									maxHeight: "600px",
									maxWidth: "550px",
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
									<Typography
										fontFamily='inter'
										fontSize={16}
									>
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
								</Grid>
								<Grid item xs={12} my={1}>
									<a
										style={{
											color: "white",
											cursor: "pointer",
										}}
										onClickCapture={(e) => {
											e.preventDefault();
											if (movie?.trailer_link) {
												console.log("Watching Trailer");
												setShowTrailer(true);
											} else {
												// showAlert(
												// 	"warning",
												// 	"Trailer not available",
												// 	"Please contact admin"
												// );
												Swal.fire({
													title: "Trailer not available",
													text: "Please contact admin",
													icon: "warning",
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
					)}
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
			{!isPlaying ? (
				<Box
					sx={{
						position: "absolute",
						top: "50vh",
						right: "50vw",
						transform: "translate(50%, -50%)",
					}}
				>
					<a
						href='#'
						onClickCapture={(e) => {
							console.log("Playing");

							//Checking for membership
							//1. If video is for anonymous users
							if (movie) {
								if (movie?.membership_required === false) {
									//PLaying video for every user
									setPlaying(true);
								} else {
									if (Object.hasOwn(movie, "video_link")) {
										//Membership is available, video can be played
										if (movie?.video_link) {
											//Video link is available for members
											setPlaying(true);
										} else {
											//Video is not available for members
											// showAlert(
											// 	"warning",
											// 	"Video is not available",
											// 	"Please contact admin"
											// );
											Swal.fire({
												title: "Video is not available",
												text: "Please contact admin",
												icon: "warning",
											});
										}
									} else {
										// showAlert(
										// 	"warning",
										// 	"Membership Required",
										// 	"This video requires membership. Please subscribe to continue watching"
										// );

										if (user?.full_name) {
											Swal.fire({
												title: "Membership Required",
												text: "Please subscribe to continue",
												icon: "warning",
												showConfirmButton: true,
												showCancelButton: true,
												confirmButtonText: "Subscribe",
												cancelButtonText: "Cancel",
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
												confirmButtonText: "Sign in",
												cancelButtonText: "Cancel",
											}).then((res) => {
												if (res.isConfirmed) {
													navigate("/login");
												}
											});
										}

										// setTimeout(() => {
										// 	navigate("/plans");
										// }, 3000);
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
			) : null}
			<Modal
				open={showTrailer}
				keepMounted
				closeAfterTransition
				onClose={() => setShowTrailer(false)}
			>
				<Box
					width='100%'
					height='100%'
					className='d-center'
					onClickCapture={(e) => {
						e.preventDefault();
						setShowTrailer(false);
					}}
				>
					<Box
						sx={{
							width: "90vw",
							height: {
								xs: "25vh",
								sm: "50vh",
								md: "95vh",
							},
						}}
					>
						<ReactPlayer
							controls
							url={`${
								BASE_URL?.includes("localhost") ? BASE_URL : ""
							}${movie?.trailer_link}`}
							width='100%'
							height='100%'
							playing={showTrailer}
						/>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default MovieDetails;
