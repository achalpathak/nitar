import * as React from "react";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import {
	IconButton,
	List,
	ListItem,
	Slider,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { intervalToDuration } from "date-fns";
import {
	FullscreenRounded,
	Settings,
	VolumeDownRounded,
	VolumeMuteRounded,
	VolumeOffRounded,
	VolumeUpRounded,
} from "@mui/icons-material";
import screenfull from "screenfull";
import { findDOMNode } from "react-dom";
import { useAppSelector } from "@redux/hooks";

const StyledPlayerControls = styled("div")`
	position: absolute;
	padding: 10px;
	box-sizing: border-box;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	opacity: 0;
	transition: opacity 0.2s ease-in-out;

	.video-player__slider {
		width: 100%;
		color: #fff;
		box-sizing: border-box;

		&--seek {
			margin-left: 12px;
			margin-right: 12px;
		}

		&--sound {
			width: 100px;
		}

		.MuiSlider-track {
			border: none;
			color: var(--website-primary-color);
		}

		.MuiSlider-thumb {
			background-color: var(--website-primary-color);

			&:before: {
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
			}

			&:hover,
			&.Mui-focusVisible,
			&.Mui-active {
				box-shadow: none;
			}
		}
	}
`;

const PlayerTopControls: React.FC<
	ReactPlayerProps & {
		playerRef: React.RefObject<ReactPlayer>;
		state: ReactPlayerProps;
	}
> = (props) => {
	const { state, dispatch, wrapperRef, playerRef } = props;
	const prefs = useAppSelector((state) => state.preferences);

	const handleSound = (_event: Event, newValue: number | number[]) => {
		dispatch({ type: "VOLUME", payload: newValue });
	};

	const handleFullscreen = () => {
		screenfull.toggle(findDOMNode(wrapperRef.current) as Element);
	};

	const handleSeek = (_event: Event, newValue: number | number[]) => {
		playerRef.current?.seekTo(newValue as number);
	};

	const toggleLevels = () => {
		dispatch({ type: "TOGGLE_LEVELS" });
	};

	const renderSeekSlider = () => {
		return (
			<Slider
				aria-label='Time'
				className={"video-player__slider video-player__slider--seek"}
				min={0}
				max={state.duration}
				step={0.01}
				value={state.progress.playedSeconds}
				onChange={handleSeek}
			/>
		);
	};

	const renderPlayButton = () => {
		return (
			<IconButton
				onClick={() => dispatch({ type: "TOGGLE_PLAY" })}
				className='custom-btn'
			>
				{state.playing ? (
					<PauseRounded sx={{ fontSize: "2rem", color: "white" }} />
				) : (
					<PlayArrowRounded
						sx={{ fontSize: "2rem", color: "white" }}
					/>
				)}
			</IconButton>
		);
	};

	const renderSoundSlider = () => {
		return (
			<Stack
				spacing={2}
				direction='row'
				sx={{ mb: 1, px: 1 }}
				alignItems='center'
			>
				{state?.volume ?? 0 > 0.5 ? (
					<IconButton
						className='custom-btn'
						onClick={() => dispatch({ type: "VOLUME", payload: 0 })}
					>
						<VolumeUpRounded
							sx={{ fontSize: "1.5rem", color: "white" }}
						/>
					</IconButton>
				) : state?.volume === 0 ? (
					<IconButton
						className='custom-btn'
						onClick={() =>
							dispatch({ type: "VOLUME", payload: 0.5 })
						}
					>
						<VolumeOffRounded
							sx={{ fontSize: "1.5rem", color: "white" }}
						/>
					</IconButton>
				) : (
					<IconButton
						className='custom-btn'
						onClick={() => dispatch({ type: "VOLUME", payload: 0 })}
					>
						<VolumeDownRounded
							sx={{ fontSize: "1.5rem", color: "white" }}
						/>
					</IconButton>
				)}
				<Slider
					aria-label='Volume'
					className={
						"video-player__slider video-player__slider--sound"
					}
					max={1}
					step={0.01}
					value={state.volume}
					onChange={handleSound}
				/>
			</Stack>
		);
	};

	const renderDurationText = () => {
		const duration = intervalToDuration({
			start: 0,
			end: state.progress.playedSeconds * 1000,
		});
		const totalDuration = intervalToDuration({
			start: 0,
			end: state.duration * 1000,
		});

		return (
			<Stack
				spacing={2}
				direction='row'
				sx={{ mb: 1, px: 1 }}
				alignItems='center'
			>
				<Typography variant='body2' color='white'>
					{duration.minutes?.toString()?.padStart(2, "0")}:
					{duration.seconds?.toString()?.padStart(2, "0")}
					{" / "}
					{totalDuration.minutes?.toString()?.padStart(2, "0")}:
					{totalDuration.seconds?.toString()?.padStart(2, "0")}
				</Typography>
			</Stack>
		);
	};

	const renderFullscreenButton = () => {
		return (
			<IconButton onClick={handleFullscreen} className='custom-btn'>
				<FullscreenRounded sx={{ fontSize: "2rem", color: "white" }} />
			</IconButton>
		);
	};

	const renderQualityControl = () => {
		const hlsPlayer = playerRef.current?.getInternalPlayer("hls");
		return (
			<IconButton
				className='custom-btn'
				sx={{
					position: "relative",
				}}
				onClick={() => toggleLevels()}
			>
				<Settings
					sx={{
						fontSize: "2rem",
						color: "white",
						transition: "all 0.3s",
						transform: state?.levelsShowing
							? "rotate(60deg)"
							: "rotate(0deg)",
					}}
				/>
				{state?.levelsShowing ? (
					<List
						sx={{
							position: "absolute",
							bottom: "2.5rem",
							backgroundColor: "rgba(0,0,0,0.5)",
							borderRadius: 2,
						}}
					>
						{hlsPlayer?.levels?.map(
							(level: any, lvlIndex: number) => (
								<ListItem
									key={level?.name}
									disablePadding
									sx={{
										padding: "5px 15px",
										"&:hover": {
											backgroundColor:
												"rgba(255,255,255,0.2)",
										},
									}}
									onClick={() => {
										hlsPlayer.currentLevel = lvlIndex;
									}}
								>
									<Typography color='white'>{`${level?.name}p`}</Typography>
								</ListItem>
							)
						)}
					</List>
				) : null}
			</IconButton>
		);
	};

	return (
		<StyledPlayerControls className={"video-player__controls"}>
			<Stack direction='row' alignItems='center'>
				{renderSeekSlider()}
			</Stack>
			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
			>
				<Stack direction='row' alignItems='center' spacing={2}>
					{renderPlayButton()} {renderSoundSlider()}{" "}
					{renderDurationText()}
				</Stack>
				<Stack direction='row' alignItems='center' spacing={2}>
					{renderQualityControl()}
					{renderFullscreenButton()}
				</Stack>
			</Stack>
		</StyledPlayerControls>
	);
};

export default PlayerTopControls;
