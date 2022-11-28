import api, { BASE_URL, Routes } from "@api";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { IBanners, IMovieItem, ISuccess } from "@types";
import { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";

type ICarouselProps = {
	items: IMovieItem[];
};

const BannerCarousel: FC<ICarouselProps> = ({ items }) => {
	const [banner, setBanner] = useState<IBanners>();

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<IBanners>>(Routes.BANNER);

				if (res.status === 200) {
					setBanner(res.data?.result);
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err.response);
			}
		})();
	}, []);

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
				height={{
					xs: "15rem",
					md: "37rem",
				}}
				className='banner-container'
			>
				<Slider
					autoplay={2000}
					infinite
					previousButton={
						<ChevronLeftOutlined
							style={{
								width: 40,
								height: 40,
								color: "white",
							}}
						/>
					}
					nextButton={
						<ChevronRightOutlined
							style={{
								width: 40,
								height: 40,
								color: "white",
							}}
						/>
					}
				>
					{banner?.poster_banner?.map((item, index) => (
						<div className='slider-content d-center'>
							<a
								href={
									item?.url_type === "EXTERNAL"
										? item?.url
										: `/movies/${item?.url}`
								}
								style={{
									height: "100%",
									width: "100%",
								}}
								className='d-center'
							>
								<picture
									className='d-center'
									style={{
										height: "100%",
										width: "100%",
									}}
								>
									<source
										media='(max-width: 500px)'
										src={`${
											BASE_URL?.includes("localhost")
												? BASE_URL
												: ""
										}${item?.mobile_banner}`}
									/>
									<img
										key={index}
										src={`${
											BASE_URL?.includes("localhost")
												? BASE_URL
												: ""
										}${item?.website_banner}`}
										alt={item?.banner_type}
										loading='lazy'
										style={{
											borderRadius: "20px",
											width: "auto",
											height: "100%",
											objectFit: "fill",
										}}
									/>
								</picture>
							</a>
						</div>
					))}
				</Slider>
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
