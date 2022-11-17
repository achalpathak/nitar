import {
	Grid,
	ImageList,
	ImageListItem,
	List,
	ListItem,
	Paper,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MovieItem from "./movie-item";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import MovieTile from "@assets/home/movie-tile.png";
import HorizontalScroll from "react-horizontal-scrolling";
import { FC } from "react";
import { IMovieList } from "@types";
import LeftRightButton from "@components/left-right-button";

const MovieList: FC<IMovieList> = ({ title, items }) => {
	if (items?.length === 0) {
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
									{title}
								</Typography>
							</Grid>
							<LeftRightButton />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid container display='flex' justifyContent='flex-end'>
					<Grid item xs={11} className='movies' mt={3}>
						<HorizontalScroll className='horizontal-scroll'>
							{items?.map((item) => (
								<div key={item.title} className='movie-item'>
									<img
										src={item.image}
										alt={item.title}
										loading='lazy'
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
											borderRadius: 10,
										}}
									/>
								</div>
							))}
						</HorizontalScroll>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default MovieList;
