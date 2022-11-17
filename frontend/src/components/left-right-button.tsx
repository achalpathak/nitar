import { Grid } from "@mui/material";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";

const LeftRightButton = () => {
	return (
		<Grid item className='left-right'>
			<Grid container>
				<Grid item>
					<a href='#'>
						<ChevronLeftOutlined />
					</a>
				</Grid>
				<Grid item>
					<a href='#'>
						<ChevronRightOutlined />
					</a>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default LeftRightButton;
