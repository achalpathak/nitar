import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Modal, Typography } from "@mui/material";
import api, { Routes } from "@api";
import { ICategories, ICategory, ICategoryItem, ISuccess } from "@types";
import { AxiosError } from "axios";
import { EpisodeList, MovieList } from "@components/movies";
import { useAlert } from "@hooks";
import "../movie-details/movie-details.scss";
import { PlayCircleOutlineOutlined } from "@mui/icons-material";
import ReactPlayer from "react-player";
import { useAppSelector } from "@redux/hooks";
import Swal from "sweetalert2";

const ExtraDetails = (props: any) => {
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
					`${Routes.EXTRAS}/${slug}/`
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
							? {
									xs: `url(${movie?.poster_large_vertical_image})`,
									sm: `url(${movie?.poster_large_horizontal_image})`,
							  }
							: "none",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						backgroundPosition: {
							xs: "center center",
							md: "inherit",
						},
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
													allowOutsideClick: () =>
														true,
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
						href=''
						onClickCapture={(e) => {
							e.preventDefault();
							console.log("Playing");

							//Checking for membership
							if (movie) {
								if (movie?.membership_required === false) {
									//PLaying video for every user
									if (movie?.video_link) {
										setPlaying(true);
									} else {
										Swal.fire({
											title: "Video is not available",
											text: "Please contact admin",
											icon: "warning",
											allowOutsideClick: () => true,
										});
									}
								} else {
									if (Object.hasOwn(movie, "video_link")) {
										//Membership is available, video can be played
										if (movie?.video_link) {
											//Video link is available for members
											if (movie?.video_link) {
												setPlaying(true);
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
												allowOutsideClick: () => true,
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
												confirmButtonText: "Subscribe",
												cancelButtonText: "Cancel",
												allowOutsideClick: () => true,
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
												allowOutsideClick: () => true,
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
							url={`${movie?.trailer_link}`}
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

export default ExtraDetails;
