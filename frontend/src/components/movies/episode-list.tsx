import LeftRightButton from "@components/left-right-button";
import { Grid, Typography } from "@mui/material";
import { ICategory, IEpisodes } from "@types";
import { useScroll, useWheel } from "@use-gesture/react";
import { FC, useRef } from "react";
import { Link } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import "./movies.scss";

const EpisodesList: FC<IEpisodes> = ({
	name,
	series,
	poster_type,
	onChange,
}) => {
	if ((series?.episodes_set?.length ?? 0) === 0) {
		return null;
	}
	const moviesRef = useRef<HTMLDivElement>(null);

	const [style, set] = useSpring(() => ({
		transform: "perspective(500px) rotateY(0deg)",
	}));

	const bind = useScroll((event) => {
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
						{series?.episodes_set?.map((img) => (
							<a
								href=''
								onClickCapture={(e) => {
									e.preventDefault();
									onChange(img);
								}}
								key={img.id}
								className='d-center'
								style={{
									flexDirection: "column",
								}}
							>
								<animated.div
									className={`movie-card ${poster_type}`}
									style={{
										...style,
										backgroundImage: `url(${img?.[poster_type]})`,
									}}
									data-episode-name={img?.name}
								/>
								<Typography mt={1} fontFamily='inter'>
									{img?.name}
								</Typography>
							</a>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default EpisodesList;
