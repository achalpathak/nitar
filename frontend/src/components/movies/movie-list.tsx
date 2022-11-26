import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MovieItem from "./movie-item";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import MovieTile from "@assets/home/movie-tile.png";
import HorizontalScroll from "react-horizontal-scrolling";
import { FC, useRef, useState } from "react";
import { ICategory, IMovieList } from "@types";
import LeftRightButton from "@components/left-right-button";
import ReactCarousel, { AFTER, CENTER, BEFORE } from "react-carousel-animated";
import "./movies.scss";
import { BASE_URL } from "@api";
import { useScroll, useWheel } from "@use-gesture/react";
import { animated, useSpring } from "react-spring";

const MovieList: FC<ICategory> = ({ name, category_items }) => {
	if ((category_items?.length ?? 0) === 0) {
		return null;
	}
	const moviesRef = useRef<HTMLDivElement>(null);

	const [style, set] = useSpring(() => ({
		transform: "perspective(500px) rotateY(0deg)",
	}));

	const bind = useScroll((event) => {
		console.log("Scrolling", event);
		set({
			transform: `perspective(500px) rotateY(${
				event.scrolling ? clamp(event.delta[0]) : 0
			}deg)`,
		});
	});

	const wheel = useWheel((event) => {
		console.log("Wheeling", event);
		set({
			transform: `perspective(500px) rotateY(${
				event.scrolling ? clamp(event.delta[0]) : 0
			}deg)`,
		});
	});

	const clamp = (value: number, clampAt: number = 30) => {
		if (value > 0) {
			return value > clampAt ? clampAt : value;
		} else {
			return value < -clampAt ? -clampAt : value;
		}
	};

	return (
		<Grid
			container
			display='flex'
			alignItems='center'
			// justifyContent='flex-end'
			mt={5}
			className='movie-list'
			maxWidth='100vw'
		>
			<Grid item xs={12}>
				<Grid container display='flex' justifyContent='center'>
					<Grid item xs={10}>
						<Grid
							container
							display='flex'
							alignItems='cener'
							justifyContent='space-between'
						>
							<Grid item>
								<Typography
									fontSize={25}
									fontFamily='Barlow Condensed'
									fontWeight='500'
									textTransform='uppercase'
									ml={1}
								>
									{name}
								</Typography>
							</Grid>
							<LeftRightButton
								onLeftClick={() => {
									moviesRef.current?.scroll({
										left: -200,
										behavior: "smooth",
									});
								}}
								onRightClick={() => {
									moviesRef.current?.scroll({
										left: 200,
										behavior: "smooth",
									});
								}}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid container display='flex' justifyContent='flex-end'>
					<Grid
						ref={moviesRef}
						item
						xs={11}
						className='movies'
						mt={3}
						data-movie={name}
						{...bind()}
						{...wheel()}
					>
						{category_items?.map((img) => (
							<animated.div
								key={img.id}
								className='movie-card'
								style={{
									...style,
									backgroundImage: `url(${
										BASE_URL?.includes("localhost")
											? BASE_URL
											: ""
									}${img.poster_small_vertical_image})`,
								}}
							>
								<a href='#'>
									<figure>
										<figcaption>
											<div>{img?.name}</div>
											<div>
												{img?.genres?.map((g) => (
													<span
														key={g?.id}
														className='genre'
													>
														{g?.name}
													</span>
												))}
											</div>
											<div className='details-btn'>
												<a
													href='#'
													className='view-details'
												>
													View Details
												</a>
											</div>
										</figcaption>
									</figure>
								</a>
							</animated.div>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default MovieList;
