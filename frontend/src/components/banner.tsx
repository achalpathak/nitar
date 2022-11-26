import { Box, Grid, Typography } from "@mui/material";
import movie1 from "@assets/home/movie1.png";
import movie2 from "@assets/home/movie2.png";
import banner from "@assets/home/banner.jpg";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { BannerCarousel, LeftRightButton } from "@components";
import { IMovieItem } from "@types";

const items: IMovieItem[] = [
	{
		title: "Movie 1",
		image: banner,
	},
	{
		title: "Movie 2",
		image: movie2,
	},
	{
		title: "Movie 1",
		image: banner,
	},
	{
		title: "Movie 2",
		image: movie2,
	},
	{
		title: "Movie 1",
		image: banner,
	},
	{
		title: "Movie 2",
		image: movie2,
	},
];

const Banner = () => {
	// return (
	// 	<Grid
	// 		container
	// 		display='flex'
	// 		alignItems='center'
	// 		justifyContent='flex-end'
	// 		mt={6}
	// 		className='movie-banner'
	// 	>
	// 		<Grid item xs={11}>
	// 			<Grid
	// 				container
	// 				columnSpacing={2}
	// 				flexDirection={{
	// 					xs: "column",
	// 					md: "row",
	// 				}}
	// 				rowSpacing={1}
	// 			>
	// 				<Grid
	// 					item
	// 					xs={12}
	// 					md={4}
	// 					lg={3}
	// 					display='flex'
	// 					alignItems='center'
	// 					justifyContent='center'
	// 				>
	// 					<Grid
	// 						container
	// 						rowSpacing={1}
	// 						display='flex'
	// 						alignItems='center'
	// 						justifyContent='center'
	// 					>
	// 						<Grid item xs={12}>
	// 							<Typography fontFamily='Barlow Condensed'>
	// 								Gullar Original
	// 							</Typography>
	// 						</Grid>
	// 						<Grid item xs={12}>
	// 							<Typography fontSize={25}>
	// 								Movie Name Here
	// 							</Typography>
	// 						</Grid>
	// 						<Grid item xs={12}>
	// 							<Typography fontSize={13} color='#AFAFAF'>
	// 								Lorem ipsum dolor sit amet, consectetur
	// 								adipiscing elit. Diam a urna dignissim
	// 								posuere elementum est. Sollicitudin proin
	// 								euismod ut est nullam malesuada proin
	// 								mollis. Sit mollis donec
	// 							</Typography>
	// 						</Grid>
	// 						<Grid item xs={12}>
	// 							<Grid
	// 								container
	// 								className='movie-tags'
	// 								flexWrap='nowrap'
	// 							>
	// 								<Grid item>
	// 									<Typography fontFamily='Barlow Condensed'>
	// 										18+
	// 									</Typography>
	// 								</Grid>
	// 								<Grid item>
	// 									<Typography fontFamily='Barlow Condensed'>
	// 										2022
	// 									</Typography>
	// 								</Grid>
	// 								<Grid item>
	// 									<Typography fontFamily='Barlow Condensed'>
	// 										Action
	// 									</Typography>
	// 								</Grid>
	// 								<Grid item>
	// 									<Typography fontFamily='Barlow Condensed'>
	// 										Romantic
	// 									</Typography>
	// 								</Grid>
	// 							</Grid>
	// 						</Grid>
	// 						<Grid item xs={12}>
	// 							<Grid container>
	// 								<Grid item mr={1}>
	// 									<PlayCircleOutlineOutlinedIcon />
	// 								</Grid>
	// 								<Grid item>
	// 									<Typography fontFamily='Barlow Condensed'>
	// 										Watch Trailer
	// 									</Typography>
	// 								</Grid>
	// 							</Grid>
	// 						</Grid>
	// 					</Grid>
	// 				</Grid>
	// 				<Grid item xs={12} md={8} lg={9} paddingLeft={0}>
	// 					<BannerCarousel items={items} />
	// 				</Grid>
	// 			</Grid>
	// 		</Grid>
	// 	</Grid>
	// );

	return (
		<Grid container>
			<Grid xs={12}>
				<BannerCarousel items={items} />
			</Grid>
		</Grid>
	);
};

export default Banner;
