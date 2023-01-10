import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Grid, Link, Modal, Typography } from "@mui/material";
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
import { PlayArrow, PlayCircleOutlineOutlined } from "@mui/icons-material";
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

	const [showMore, setShowMore] = useState<boolean>(false);

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
			<Grid container display='flex' className='movie-details d-center'>
				<Grid
					container
					display='flex'
					className='movie-details d-center'
					px={2}
				>
					<Grid
						item
						xs={12}
						md={10}
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
								position: "relative",
								width: "100%",
								height: "100%",
								objectFit: "contain",
								borderRadius: 15,
							}}
						/>

						<Box className='position-absolute d-center play-btn'>
							<a
								href=''
								onClickCapture={(e) => {
									e.preventDefault();
									console.log("Playing");

									//Checking for membership
									if (movie) {
										if (
											movie?.membership_required === false
										) {
											//PLaying video for every user
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
											if (
												Object.hasOwn(
													movie,
													"video_link"
												)
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
															allowOutsideClick:
																() => true,
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
														cancelButtonText:
															"Cancel",
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
														cancelButtonText:
															"Cancel",
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
						<Grid
							container
							position='absolute'
							top={0}
							left={0}
							right={0}
							bottom={0}
							display={{
								xs: "none",
								md: "flex",
							}}
							justifyContent='center'
						>
							<Grid
								item
								xs={12}
								sx={{
									maxHeight: "600px",
									alignSelf: "center",
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
										lineHeight='1.5rem'
										height={showMore ? "auto" : "1.5rem"}
										overflow={
											showMore ? "visible" : "hidden"
										}
										maxWidth={showMore ? "100%" : "50%"}
									>
										{movie?.description}
									</Typography>
									<Link
										href='#'
										onClickCapture={(e) => {
											e.preventDefault();
											setShowMore((val) => !val);
										}}
										sx={{
											color: "var(--website-primary-color) !important",
											textDecoration: "none",
										}}
									>
										{showMore ? "Hide More" : "Show More"}
									</Link>
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
												textTransform='capitalize'
											>
												{movie?.age_rating}
											</Typography>
										</Box>
										{movie?.genres?.map((g, i) => (
											<Box
												key={g?.id}
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
													textTransform='capitalize'
												>
													{g?.name}
												</Typography>
											</Box>
										))}
									</Box>
								</Grid>
								<Grid item xs={12}>
									<Grid container>
										{movie?.director_name ? (
											<Grid item mr={2}>
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
														{movie?.director_name ??
															""}
													</Typography>
												</Box>
											</Grid>
										) : null}
										{movie?.language ? (
											<Grid item mr={2}>
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
															<Grid item mr={2}>
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
													allowOutsideClick: () =>
														true,
												});
											}
										}}
									>
										<Grid container mt={2}>
											<Grid
												item
												mr={1}
												className='d-center'
											>
												<PlayCircleOutlineOutlined
													style={{
														fontSize: "2.5rem",
														color: "var(--website-primary-color)",
													}}
												/>
											</Grid>
											<Grid item className='d-center'>
												<Typography
													fontFamily='Barlow Condensed'
													style={{
														fontSize: "1.5rem",
													}}
												>
													Watch Trailer
												</Typography>
											</Grid>
										</Grid>
									</a>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid
						container
						display={{
							xs: "flex",
							md: "none",
						}}
						justifyContent='center'
					>
						<Grid
							item
							xs={12}
							md={10}
							sx={{
								maxHeight: "600px",
								alignSelf: "center",
							}}
							p={2}
						>
							<Grid container className='d-center'>
								<Grid item xs={12} sm={6}>
									<Typography
										fontFamily='Playfair Display'
										fontSize={40}
									>
										{movie?.name}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box
										display='flex'
										alignItems='center'
										justifyContent={{
											xs: "flex-start",
											sm: "flex-end",
										}}
										my={1}
									>
										<Box
											mr={2}
											className='genre'
											sx={{
												backgroundColor: "black",
											}}
										>
											<Typography
												fontFamily='Barlow Condensed'
												fontSize={16}
												textTransform='capitalize'
											>
												{movie?.age_rating}
											</Typography>
										</Box>
										{movie?.genres?.map((g, i) => (
											<Box
												key={g?.id}
												mr={2}
												className='genre'
												sx={{
													backgroundColor: "black",
												}}
											>
												<Typography
													fontFamily='Barlow Condensed'
													fontSize={16}
													textTransform='capitalize'
												>
													{g?.name}
												</Typography>
											</Box>
										))}
									</Box>
								</Grid>
							</Grid>
							<Grid item xs={12} my={1}>
								<Typography
									fontFamily='inter'
									fontSize={16}
									lineHeight='1.5rem'
									height={showMore ? "auto" : "1.5rem"}
									overflow={showMore ? "visible" : "hidden"}
								>
									{movie?.description}
								</Typography>
								<Link
									href='#'
									onClickCapture={(e) => {
										e.preventDefault();
										setShowMore((val) => !val);
									}}
									sx={{
										color: "var(--website-primary-color) !important",
										textDecoration: "none",
									}}
								>
									{showMore ? "Hide More" : "Show More"}
								</Link>
							</Grid>
							<Grid item xs={12}>
								<Grid container>
									{movie?.director_name ? (
										<Grid item xs={12}>
											<Grid
												container
												className='d-center'
											>
												<Grid item xs={6} sm={3}>
													<Typography
														variant='h5'
														fontFamily='Barlow Condensed'
														mr={2}
													>
														Director :
													</Typography>
												</Grid>
												<Grid item xs={6} sm={9}>
													<Typography>
														{movie?.director_name ??
															""}
													</Typography>
												</Grid>
											</Grid>
										</Grid>
									) : null}
									{movie?.language ? (
										<Grid item xs={12} my={1}>
											<Grid
												container
												className='d-center'
											>
												<Grid item xs={6} sm={3}>
													<Typography
														variant='h5'
														fontFamily='Barlow Condensed'
														mr={2}
													>
														Language :
													</Typography>
												</Grid>
												<Grid item xs={6} sm={9}>
													<Typography>
														{movie?.language ?? ""}
													</Typography>
												</Grid>
											</Grid>
										</Grid>
									) : null}
								</Grid>
								<Grid item xs={12}>
									{movie?.star_cast ? (
										<Grid
											container
											display='flex'
											justifyContent='center'
										>
											<Grid item xs={6} sm={3}>
												<Typography
													variant='h5'
													fontFamily='Barlow Condensed'
													mb={1}
												>
													Star Cast :
												</Typography>
											</Grid>
											<Grid item xs={6} sm={9}>
												<Grid container>
													{movie?.star_cast
														?.split(",")
														?.map((sc, sc_i) => (
															<Grid item mr={2}>
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
									<Grid container mt={2}>
										<Grid item mr={1} className='d-center'>
											<PlayCircleOutlineOutlined
												style={{
													fontSize: "2.5rem",
													color: "var(--website-primary-color)",
												}}
											/>
										</Grid>
										<Grid item className='d-center'>
											<Typography
												fontFamily='Barlow Condensed'
												style={{
													fontSize: "1.5rem",
												}}
											>
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
