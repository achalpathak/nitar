import * as React from "react";
import { Box, IconButton, styled } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import PlayerTopControls from "./PlayerTopControls";
import PlayerBottomControls from "./PlayerBottomControls";
import PlayerOverlay from "./PlayerOverlay";
import { INITIAL_STATE, reducer } from "./Player.reducer";
import { ArrowBack } from "@mui/icons-material";

const StyledPlayer = styled("div")<ReactPlayerProps>`
	position: relative;
	// aspect-ratio: 16/9;
	border-radius: 8px;
	height: 100%;
	width: 100%;
	background-color: black;
	display: flex;
	align-items: center;
	justify-content: center;

	video,
	.react-player__preview {
		border-radius: 8px;
	}

	// defined from script, if props light is true then is visible
	.react-player__preview:before {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
	}

	&:hover {
		.video-player__controls {
			opacity: 1;
		}
	}

	.video-player__controls {
		opacity: ${({ state }) =>
			state.light ? "0" : state.playing ? "0" : "1"};
	}
`;

const Player: React.FC<
	ReactPlayerProps & {
		name: string;
		description: string;
		closePlayer: () => void;
	}
> = (props) => {
	const { url, light, closePlayer } = props;
	const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
	const playerRef = React.useRef<ReactPlayer>(null);
	const wrapperRef = React.useRef<HTMLDivElement>(null);

	const handlePreview = () => {
		dispatch({ type: "PLAY" });
		dispatch({ type: "CUSTOM_CONTROLS", payload: true });
		dispatch({ type: "LIGHT", payload: false });
	};

	const handlePause = () => {
		dispatch({ type: "PAUSE" });
	};

	const handlePlay = () => {
		dispatch({ type: "PLAY" });
	};

	const handleEnded = () => {
		dispatch({ type: "LIGHT", payload: true });
		playerRef.current?.showPreview();
	};

	const handleProgress = (progress: { playedSeconds: number }) => {
		dispatch({ type: "SEEK", payload: progress.playedSeconds });
	};

	const handleDuration = (duration: number) => {
		dispatch({ type: "DURATION", payload: duration });
	};

	return (
		<StyledPlayer state={state} ref={wrapperRef}>
			<ReactPlayer
				ref={playerRef}
				url={url}
				width='100%'
				height='100%'
				light={light}
				playIcon={
					<PlayArrowRounded
						sx={{
							color: "white",
							fontSize: "6rem",
						}}
					/>
				}
				style={{
					aspectRatio: 16 / 9,
				}}
				controls={state.controls}
				loop={state.loop}
				muted={state.muted}
				playing={state.playing}
				playbackRate={state.playbackRate}
				volume={state.volume}
				onPlay={handlePlay}
				onEnded={handleEnded}
				onPause={handlePause}
				onDuration={handleDuration}
				onProgress={handleProgress}
				onClickPreview={handlePreview}
				config={{
					file: {
						forceHLS: true,
						hlsVersion: "1.2.8",
					},
				}}
			/>
			<PlayerOverlay
				state={state}
				dispatch={dispatch}
				name={props?.name}
				description={props?.description}
				isTrailer={props?.isTrailer}
			/>
			{!state.controls && (
				<>
					<PlayerTopControls
						state={state}
						dispatch={dispatch}
						playerRef={playerRef}
						wrapperRef={wrapperRef}
						closePlayer={() => closePlayer()}
					/>
					<PlayerBottomControls
						state={state}
						dispatch={dispatch}
						playerRef={playerRef}
						wrapperRef={wrapperRef}
					/>
				</>
			)}
		</StyledPlayer>
	);
};

export default Player;
