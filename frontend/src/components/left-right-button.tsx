import { Grid } from "@mui/material";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { FC } from "react";

type ILeftRightButtonProps = {
	onLeftClick: () => void;
	onRightClick: () => void;
};

const LeftRightButton: FC<ILeftRightButtonProps> = ({
	onLeftClick,
	onRightClick,
}) => {
	return (
		<Grid item className='left-right'>
			<Grid container>
				<Grid item>
					<a
						href='#'
						onClickCapture={(e) => {
							e.preventDefault();
							onLeftClick();
						}}
					>
						<ChevronLeftOutlined />
					</a>
				</Grid>
				<Grid item>
					<a
						href='#'
						onClickCapture={(e) => {
							e.preventDefault();
							onRightClick();
						}}
					>
						<ChevronRightOutlined />
					</a>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default LeftRightButton;
