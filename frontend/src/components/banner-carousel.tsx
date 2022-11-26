import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { IMovieItem } from "@types";
import { FC, useState } from "react";
import ReactCarousel from "react-carousel-animated";

type ICarouselProps = {
	items: IMovieItem[];
};

const BannerCarousel: FC<ICarouselProps> = ({ items }) => {
	const [currentIdx, setCurrentIdx] = useState<number>(0);
	// const [upcomingMovies, setUpcomingMovies] = useState<
	// 	Partial<ICategoryItem>[]
	// >([
	//     {
	//         name: 'Aquaman'
	//     }
	// ]);

	return (
		<Grid
			container
			display='flex'
			flexDirection='row'
			columnSpacing={2}
			rowSpacing={2}
			height='100%'
		>
			<Grid
				item
				xs={12}
				overflow='hidden'
				display='flex'
				flex={3}
				style={{
					paddingLeft: 0,
				}}
			>
				<ReactCarousel
					carouselConfig={{
						transform: {
							zIndex: false,
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
					// carouselHeight='400px'
					showIndices={false}
					containerStyle={{
						height: "100%",
					}}
				>
					{items.map((image, index) => (
						<div
							className='movie-item-upcoming'
							style={{
								height: "100%",
								cursor: "pointer",
							}}
						>
							<img
								key={index}
								// src={`${
								// 	BASE_URL?.includes("localhost")
								// 		? BASE_URL
								// 		: ""
								// }${image.image}`}
								src={image?.image}
								alt={image?.title}
								loading='lazy'
								style={{
									// height: "300px",
									borderRadius: "20px",
									width: "100vw",
									height: "100%",
									objectFit: "contain",
									// boxShadow: "0 7px 20px 2px rgb(150, 170, 180)",
									// margin: "1rem",
								}}
							/>
						</div>
					))}
				</ReactCarousel>
			</Grid>
			{/* <Grid item xs={9} display='flex' flex={1}>
				<Grid container justifyContent='space-between'>
					<Grid item>
						<LeftRightButton
							onLeftClick={() => {
								if (currentIdx === 0) {
									setCurrentIdx(items?.length - 1);
								} else {
									setCurrentIdx((v) => v - 1);
								}
							}}
							onRightClick={() => {
								if (currentIdx === items?.length - 1) {
									setCurrentIdx(0);
								} else {
									setCurrentIdx((v) => v + 1);
								}
							}}
						/>
					</Grid>
					<Grid item className='banner-position'>
						<Grid container columnSpacing={2}>
							<Grid item>
								<span className='current'>
									{currentIdx + 1}
								</span>
							</Grid>
							<Grid item className='divider'></Grid>
							<Grid item>
								<span className='total'>{items?.length}</span>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid> */}
		</Grid>
	);
};

export default BannerCarousel;
