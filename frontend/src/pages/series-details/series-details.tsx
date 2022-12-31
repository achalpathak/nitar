import api, { Routes } from "@api";
import { EpisodeList, MovieList } from "@components/movies";
import Player from "@components/Player";
import { useAlert } from "@hooks";
import { PlayArrow, PlayCircleOutlineOutlined } from "@mui/icons-material";
import { Box, Grid, Modal, Typography } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import {
	ICategories,
	ICategory,
	ICategoryItem,
	IEpisodesSet,
	ISeriesItem,
	ISuccess,
} from "@types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../movie-details/movie-details.scss";

const ExtraDetails = (props: any) => {
	const { slug } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const showAlert = useAlert();
	const user = useAppSelector((state) => state.user);

	const [movie, setMovie] = useState<ISeriesItem>();
	const [similarMovies, setSimilarMovies] = useState<ICategory>();

	const [showTrailer, setShowTrailer] = useState<boolean>(false);
	const [showMovie, setShowMovie] = useState<boolean>(false);

	// const [isPlaying, setPlaying] = useState<boolean>(false);

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
			<Grid
				container
				display='flex'
				className='movie-details d-center'
				px={2}
			>
				<Grid
					item
					xs={12}
					md={8}
					sx={{
						position: "relative",
						borderRadius: 15,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						alignSelf: "center",
					}}
				>
					<img
						src={movie?.poster_large_horizontal_image}
						alt={movie?.name}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
							borderRadius: 15,
						}}
					/>
				</Grid>
				<Grid item xs={12} md={8} mt={2}>
					<Grid container>
						<Grid
							item
							xs={12}
							display='flex'
							alignItems={{
								xs: "flex-start",
								sm: "center",
							}}
							justifyContent='space-between'
							flexDirection={{
								xs: "column",
								sm: "row",
							}}
						>
							<Typography fontSize={40}>{movie?.name}</Typography>
							<Box display='flex'>
								{movie?.genres?.map((g, i) => (
									<Box key={g?.id} className='genre' mr={2}>
										<Typography
											fontSize={16}
											textTransform='capitalize'
										>
											{g?.name}
										</Typography>
									</Box>
								))}
							</Box>
						</Grid>
						<Grid item xs={12} className='d-flex'>
							<Grid container mt={2}>
								<Grid item mr={2}>
									<button
										className='custom-btn bg-color-primary d-center border-none'
										style={{
											borderRadius: "4px 4px 12px",
											padding: "5px 15px",
										}}
										onClickCapture={(e) => {
											e.preventDefault();
											console.log("Playing");

											//Checking for membership
											if (currentlyPlaying) {
												if (
													currentlyPlaying?.membership_required ===
													false
												) {
													if (
														currentlyPlaying?.video_link
													) {
														setShowMovie(true);
													} else {
														Swal.fire({
															title: "Video is not available",
															text: "Please contact admin",
															icon: "warning",
															allowOutsideClick:
																() => true,
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
														if (
															currentlyPlaying?.video_link
														) {
															//Video link is available for members
															setShowMovie(true);
														} else {
															//Video is not available for members
															Swal.fire({
																title: "Video is not available",
																text: "Please contact admin",
																icon: "warning",
																allowOutsideClick:
																	() => true,
															});
														}
													} else {
														//video_link is not available, check if user is logged in or not
														if (user?.full_name) {
															Swal.fire({
																title: "Membership Required",
																text: "Please subscribe to continue",
																icon: "warning",
																showConfirmButton:
																	true,
																showCancelButton:
																	true,
																confirmButtonText:
																	"Subscribe",
																cancelButtonText:
																	"Cancel",
																allowOutsideClick:
																	() => true,
															}).then((res) => {
																if (
																	res.isConfirmed
																) {
																	navigate(
																		"/plans"
																	);
																}
															});
														} else {
															Swal.fire({
																title: "Login",
																text: "Please sign in to continue",
																icon: "warning",
																showConfirmButton:
																	true,
																showCancelButton:
																	true,
																confirmButtonText:
																	"Sign in",
																cancelButtonText:
																	"Cancel",
																allowOutsideClick:
																	() => true,
															}).then((res) => {
																if (
																	res.isConfirmed
																) {
																	navigate(
																		"/login"
																	);
																}
															});
														}
													}
												}
											}
										}}
									>
										<PlayArrow
											sx={{
												marginRight: 1,
											}}
										/>
										<Typography fontSize={16}>
											Play
										</Typography>
									</button>
								</Grid>
								<Grid item>
									<button
										className='custom-btn bg-color-alternate color-primary d-center border-none'
										style={{
											borderRadius: "4px 4px 12px",
											padding: "5px 15px",
											border: "0.5px solid white",
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
										<PlayCircleOutlineOutlined
											sx={{
												marginRight: 1,
											}}
										/>
										<Typography
											fontSize={16}
											className='color-primary'
										>
											Watch Trailer
										</Typography>
									</button>
								</Grid>
							</Grid>
						</Grid>
						<Grid
							item
							xs={12}
							mt={3}
							sx={{
								borderTop:
									"1px solid var(--website-primary-color)",
							}}
						>
							<Grid container my={4}>
								<Grid item xs={12}>
									<Typography fontSize={20}>
										Description
									</Typography>
								</Grid>
								<Grid item my={4} xs={12}>
									<Typography fontSize={16}>
										{movie?.description}
									</Typography>
								</Grid>
								{movie?.director_name ? (
									<>
										<Grid item xs={12}>
											<Grid container>
												<Grid item xs={4}>
													<Typography fontSize={16}>
														Director
													</Typography>
												</Grid>
												<Grid item xs={8}>
													<Typography fontSize={16}>
														{movie?.director_name}
													</Typography>
												</Grid>
											</Grid>
										</Grid>
									</>
								) : null}
								{movie?.star_cast ? (
									<>
										<Grid item xs={12}>
											<Grid container>
												<Grid item xs={4}>
													<Typography fontSize={16}>
														Cast
													</Typography>
												</Grid>
												<Grid item xs={8}>
													<Typography fontSize={16}>
														{movie?.star_cast}
													</Typography>
												</Grid>
											</Grid>
										</Grid>
									</>
								) : null}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				{movie ? (
					<Grid item xs={12} md={8}>
						<EpisodeList
							name='Episodes'
							series={movie}
							poster_type={"poster_small_vertical_image"}
							onChange={(item) => {
								if (item?.membership_required === false) {
									//PLaying video for every user
									if (item?.video_link) {
										setCurrentlyPlaying(item);
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
									if (Object.hasOwn(item, "video_link")) {
										//Membership is available, video can be played
										if (item?.video_link) {
											//Video link is available for members
											setCurrentlyPlaying(item);
											setShowMovie(true);
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
				<Grid item xs={12} md={8}>
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
							name={movie?.name ?? ""}
							description={movie?.description ?? ""}
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
							url={currentlyPlaying?.video_link}
							name={currentlyPlaying?.name ?? ""}
							description={currentlyPlaying?.description ?? ""}
							closePlayer={() => setShowMovie(false)}
						/>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default ExtraDetails;
