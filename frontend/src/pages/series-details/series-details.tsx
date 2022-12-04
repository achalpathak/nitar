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
	ISeriesItem,
	ISuccess,
} from "@types";
import { AxiosError } from "axios";
import { EpisodeList, MovieList } from "@components/movies";
import { useAlert } from "@hooks";
import "../movie-details/movie-details.scss";
import { PlayCircleOutlineOutlined } from "@mui/icons-material";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";
import { useAppSelector } from "@redux/hooks";

const ExtraDetails = (props: any) => {
	const { slug } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const showAlert = useAlert();
	const user = useAppSelector((state) => state.user);

	const [movie, setMovie] = useState<ISeriesItem>();
	const [similarMovies, setSimilarMovies] = useState<ICategory>();

	const [showTrailer, setShowTrailer] = useState<boolean>(false);
	const [isPlaying, setPlaying] = useState<boolean>(false);

	const [currentlyPlaying, setCurrentlyPlaying] = useState<IEpisodesSet>();

	useEffect(() => {
		console.log("Currently Playing", currentlyPlaying);
	}, [currentlyPlaying]);

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
				const res = await api.get<ISuccess<ICategoryItem>>(
					`${Routes.SERIES}/${slug}/`
				);

				if (res.status === 200) {
					setMovie(res.data?.result);
					setCurrentlyPlaying(res.data?.result?.episodes_set[0]);
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
							sm: "top",
						},
						height: {
							md: "35rem",
							sm: "25rem",
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
								{(currentlyPlaying?.video_link ?? "") !== "" ? (
									<ReactPlayer
										controls
										url={`${currentlyPlaying?.video_link}`}
										width='100%'
										height='100%'
										onReady={(e) => {
											console.log("Player ready", e);
										}}
										config={{
											file: {
												forceHLS: true,
												hlsVersion: "1.2.8",
											},
										}}
									/>
								) : null}
							</Box>
							<Box m={2}>
								<Typography fontFamily='inter' fontSize={25}>
									{movie?.name} - {currentlyPlaying?.name}
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
										{movie?.genres?.map((g, i) => (
											<Box
												key={g.id}
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
													{g.name}
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
													title: "Trailer is not available",
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
				{movie ? (
					<Grid item xs={12}>
						<EpisodeList
							name='Episodes'
							series={movie}
							poster_type={"poster_small_vertical_image"}
							onChange={(item) => {
								if (item?.membership_required === false) {
									//PLaying video for every user
									if (item?.video_link) {
										setCurrentlyPlaying(item);
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
									if (Object.hasOwn(item, "video_link")) {
										//Membership is available, video can be played
										if (item?.video_link) {
											//Video link is available for members
											setCurrentlyPlaying(item);
											setPlaying(true);
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
												title: "Sign in",
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
							}}
						/>
					</Grid>
				) : null}
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
							e.preventDefault();
							console.log("Playing");

							//Checking for membership
							if (currentlyPlaying) {
								if (
									currentlyPlaying?.membership_required ===
									false
								) {
									if (currentlyPlaying?.video_link) {
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
									if (
										Object.hasOwn(
											currentlyPlaying,
											"video_link"
										)
									) {
										//Membership is available, video can be played
										if (currentlyPlaying?.video_link) {
											//Video link is available for members
											setPlaying(true);
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
			{movie?.trailer_link ? (
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
						<Box width='90vw' height='70vw'>
							<ReactPlayer
								controls
								url={`${movie?.trailer_link}`}
								width='100%'
								height='100%'
								playing={showTrailer}
								config={{
									file: {
										forceHLS: true,
										hlsVersion: "1.2.8",
									},
								}}
							/>
						</Box>
					</Box>
				</Modal>
			) : null}
		</>
	);
};

export default ExtraDetails;
