import api, { BASE_URL, Routes } from "@api";
import { DownloadApp, SubscribeButton } from "@components";
import { MovieList } from "@components/movies";
import { useAlert } from "@hooks";
import { ICategories, ICategory, ICategoryItem, ISuccess } from "@types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import "./upcoming.scss";
import moment from "moment";

const Upcoming = () => {
	const showAlert = useAlert();

	const [upcomingMovies, setUpcomingMovies] = useState<ICategoryItem[]>([]);
	const [trendingMovies, setTrendingMovies] = useState<ICategory>();
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<ICategories>>(
					Routes.HOME_PAGE_LISTINGS
				);

				if (res.status === 200) {
					setTrendingMovies(
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
				const res = await api.get<ISuccess<ICategoryItem[]>>(
					Routes.UPCOMING
				);

				if (res.status === 200) {
					setUpcomingMovies(res.data?.result);
					console.log("Upcoming Movies", res.data?.result);
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err?.response);
				showAlert("error", "Error", err?.response?.data?.message);
			}
		})();
	}, []);

	useEffect(() => {
		const prevBtn = document.querySelector(".carousel__prev");
		const nextBtn = document.querySelector(".carousel__next");

		const prevListener = (e: Event) => {
			console.log("Prev Button Clicked");
			setCurrentIndex((v) => v - 1);
		};

		const nextListener = (e: Event) => {
			console.log("Next Button Clicked");
			setCurrentIndex((v) => v + 1);
		};

		prevBtn?.addEventListener("click", prevListener);
		nextBtn?.addEventListener("click", nextListener);

		return () => {
			prevBtn?.removeEventListener("click", prevListener);
			nextBtn?.removeEventListener("click", nextListener);
		};
	}, []);

	useEffect(() => {
		console.log(
			"CurrentIndex",
			currentIndex,
			upcomingMovies?.at(currentIndex)
		);
	}, [currentIndex]);

	return (
		<>
			<Grid container justifyContent='center'>
				<Grid item xs={12} mt={3}>
					<Grid container px={3}>
						{upcomingMovies?.map((image, index) => (
							<Grid
								item
								xs={12}
								sm={4}
								mb={2}
								className='movie-item-container'
								sx={{
									"&:hover": {
										zIndex: 3,
									},
								}}
							>
								<div className='movie-item-upcoming'>
									<a href='#'>
										<figure>
											<picture>
												<img
													key={image?.id}
													src={`${
														BASE_URL?.includes(
															"localhost"
														)
															? BASE_URL
															: ""
													}${
														image.poster_large_vertical_image
													}`}
													alt={image?.name}
													loading='lazy'
													className='poster'
												/>
											</picture>
											<div className='details'>
												<Typography fontFamily='Barlow Condensed'>
													{image?.name}
												</Typography>
												<Typography fontFamily='Barlow Condensed'>
													<>
														Release Date:{" "}
														{moment(
															image?.release_date_time
														).format("DD/MM/YYYY")}
													</>
												</Typography>
											</div>
										</figure>
									</a>
								</div>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
			{trendingMovies ? <MovieList {...trendingMovies} /> : null}
		</>
	);
};

export default Upcoming;
