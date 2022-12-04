import { BannerCarousel } from "@components";
import { Grid } from "@mui/material";

const Banner = () => {
	return (
		<Grid container>
			<Grid xs={12}>
				<BannerCarousel />
			</Grid>
		</Grid>
	);
};

export default Banner;
