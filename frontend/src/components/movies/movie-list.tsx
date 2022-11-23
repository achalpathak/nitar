import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MovieItem from "./movie-item";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import MovieTile from "@assets/home/movie-tile.png";
import HorizontalScroll from "react-horizontal-scrolling";
import { FC, useState } from "react";
import { ICategory, IMovieList } from "@types";
import LeftRightButton from "@components/left-right-button";
import ReactCarousel, { AFTER, CENTER, BEFORE } from "react-carousel-animated";
import "./movies.scss";
import { BASE_URL } from "@api";

const MovieList: FC<ICategory> = ({ name, category_items }) => {
	if ((category_items?.length ?? 0) === 0) {
		return null;
	}

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
								>
									{name}
								</Typography>
							</Grid>
							<LeftRightButton
								onLeftClick={() => {
									const prevBtn = document.querySelector(
										`div[data-movie="${name}"] .carousel__prev`
									) as HTMLDivElement;

									prevBtn.click();
								}}
								onRightClick={() => {
									const nextBtn = document.querySelector(
										`div[data-movie="${name}"] .carousel__next`
									) as HTMLDivElement;

									nextBtn.click();
								}}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid container display='flex' justifyContent='flex-end'>
					<Grid
						item
						xs={11}
						className='movies'
						mt={3}
						overflow='hidden'
						data-movie={name}
					>
						{/* <Box whiteSpace='nowrap'>
							{category_items?.map((item, i) => (
								<MovieItem
									key={item.rankings}
									item={item}
									currentIndex={activeIndex}
								/>
							))}
						</Box> */}
						<ReactCarousel
							carouselConfig={{
								transform: false,
								top: false,
								left: false,
								filter: false,
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
							carouselHeight='250px'
							// itemMaxWidth={50}
						>
							{category_items.map((image, index) => (
								<MovieItem key={image?.id} item={image} />
							))}
						</ReactCarousel>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default MovieList;
