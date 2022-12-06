import { ArrowBack } from "@mui/icons-material";
import { IconButton, Stack, styled } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import * as React from "react";
import { ReactPlayerProps } from "react-player";

const StyledPlayerControls = styled("div")`
	position: absolute;
	padding: 10px;
	box-sizing: border-box;
	top: 0;
	left: 0;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.6);
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

const PlayerControls: React.FC<
	ReactPlayerProps & { closePlayer: () => void }
> = (props) => {
	const { state, dispatch, wrapperRef, playerRef, closePlayer } = props;
	const prefs = useAppSelector((state) => state.preferences);

	const renderBackButton = () => {
		return (
			<IconButton
				onClick={() => {
					console.log("Clicking Close Button");
					closePlayer();
				}}
				className='custom-btn '
				style={{
					cursor: "pointer video-player__controls",
				}}
			>
				<ArrowBack sx={{ fontSize: "2rem", color: "white" }} />
			</IconButton>
		);
	};

	return (
		<StyledPlayerControls className={"video-player__controls"}>
			<Stack direction='row' alignItems='center'>
				{renderBackButton()}
			</Stack>
		</StyledPlayerControls>
	);
};

export default PlayerControls;
