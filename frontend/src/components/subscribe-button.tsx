import { Grid, Typography } from "@mui/material";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import "./component.scss";

const SubscribeButton = () => {
	return (
		<Grid
			container
			justifyContent='center'
			className='subscribe-button-container'
			mt={3}
		>
			<Grid item xs={10} md={7} className='subscribe-bg'>
				<Grid container>
					<Grid item xs={12} mb={6}>
						<Grid container>
							<Grid item xs={12}>
								<Typography
									fontFamily='Barlow Condensed'
									fontSize={{
										xs: "2rem",
										md: "3rem",
									}}
									fontWeight='bold'
								>
									Subscribe Newsletter
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography fontFamily='inter' fontSize='1rem'>
									Get Update With Upcomings
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={10} md={7} className='subscribe-button'>
						<Grid container>
							<Grid item xs={6} sm={9}>
								<input
									placeholder='Email Address'
									className='no-outline'
									type='text'
								/>
							</Grid>
							<Grid item xs={6} sm={3}>
								<Grid container justifyContent='space-between'>
									<Grid item xs={9} pl={1}>
										<Typography
											fontFamily='inter'
											fontSize='0.6rem'
										>
											Subscribe
										</Typography>
									</Grid>
									<Grid item xs={3} justifyContent='flex-end'>
										<ChevronRightOutlined />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default SubscribeButton;
