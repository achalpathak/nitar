import api, { BASE_URL, Routes } from "@api";
import { DownloadApp, SubscribeButton } from "@components";
import MovieList from "@components/movies";
import { useAlert } from "@hooks";
import { ICategories, ICategory, ICategoryItem, ISuccess } from "@types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import ReactCarousel, { AFTER, CENTER, BEFORE } from "react-carousel-animated";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import "./upcoming.scss";

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
			<Grid
				container
				justifyContent='center'
				// sx={{
				// 	backgroundImage: `url(${BASE_URL}${
				// 		upcomingMovies?.at(currentIndex)
				// 			?.poster_large_horizontal_image
				// 	})`,
				// 	// filter: "brightness(0.2)",
				//     background: {

				//     }
				// }}
			>
				<Grid item xs={12} md={8} xl={6}>
					<ReactCarousel
						carouselConfig={{
							transform: {
								rotateY: {
									[BEFORE]: () => "rotateY(25deg)",
									[CENTER]: () => "rotateY(0deg)",
									[AFTER]: () => "rotateY(-25deg)",
								},
								translateX: {
									[BEFORE]: () => "translateX(75%)",
									[CENTER]: () => "translateX(-50%)",
									[AFTER]: () => "translateX(-75%)",
								},
							},
						}}
						itemBackgroundStyle={{
							// backgroundColor: "#ece4db",
							borderRadius: "3px",
							// boxShadow: "8px 12px 14px -6px black",
						}}
						containerBackgroundStyle={{
							filter: "blur(7px)",
							// backgroundColor: "rgba(62, 212, 214, 0.3)",
						}}
						prevButtonText={
							<ChevronLeftOutlined
								style={{
									width: 40,
									height: 40,
								}}
							/>
						}
						nextButtonText={
							<ChevronRightOutlined
								style={{
									width: 40,
									height: 40,
								}}
							/>
						}
						carouselHeight='400px'
						showIndices={true}
					>
						{upcomingMovies.map((image, index) => (
							<div className='movie-item-upcoming'>
								<a href='#'>
									<figure>
										<img
											key={image?.id}
											src={`${
												BASE_URL?.includes("localhost")
													? BASE_URL
													: ""
											}${
												image.poster_large_vertical_image
											}`}
											alt={image?.name}
											loading='lazy'
											style={{
												height: "300px",
												borderRadius: "20px",
												// boxShadow: "0 7px 20px 2px rgb(150, 170, 180)",
												// margin: "1rem",
											}}
										/>
										<figcaption>
											<div>{image?.name}</div>
											<div>
												{image?.genres?.map((g) => (
													<span
														key={g?.id}
														className='genre'
													>
														{g?.name}
													</span>
												))}
											</div>
											<a
												href='#'
												className='view-details'
											>
												View Details
											</a>
										</figcaption>
									</figure>
								</a>
							</div>
						))}
					</ReactCarousel>
				</Grid>
			</Grid>
			<SubscribeButton />
			{trendingMovies ? <MovieList {...trendingMovies} /> : null}
			<DownloadApp />
		</>
	);
};

export default Upcoming;
