import { AppStore, GooglePlay } from "@assets";
import { Box, Grid, Typography } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import "./download-app.scss";

const DownloadApp = () => {
	const prefs = useAppSelector((state) => state.preferences);
	// return (
	// 	<div className='download-app-container'>
	// 		<img
	// 			alt='Download App'
	// 			src={downloadApp}
	// 			width='50%'
	// 			// height='100%'
	// 		></img>
	// 	</div>
	// );
	return (
		<Grid container my={10}>
			<Grid item xs={12}>
				<Grid container className='d-center'>
					<Grid item xs={12} md={6}>
						<Grid container>
							<Grid item xs={6}></Grid>
							<Grid item xs={6}>
								<Typography
									variant='h6'
									fontWeight='bold'
									fontFamily='Barlow Condensed'
									mb={2}
								>
									Download the App
								</Typography>
								<Typography
									variant='body2'
									fontFamily='inter'
									mb={2}
								>
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Est et sollicitudin velit
									laoreet elementum mauris. Nibh neque velit.
								</Typography>
								<Grid container className='d-center'>
									<Grid
										item
										xs={6}
										display='flex'
										flexDirection='column'
										justifyContent='space-between'
									>
										<Box
											mr={1}
											display='flex'
											flexDirection='column'
											alignItems='center'
											justifyContent='space-evenly'
											alignSelf='flex-end'
										>
											<Box>
												<a
													href={
														prefs?.find(
															(v) =>
																v.field ===
																"play_store_link"
														)?.value
													}
													target='_blank'
												>
													<GooglePlay
														width='100%'
														height='auto'
													/>
												</a>
											</Box>
											<Box>
												<a
													href={
														prefs?.find(
															(v) =>
																v.field ===
																"apple_store_link"
														)?.value
													}
													target='_blank'
												>
													<AppStore
														width='100%'
														height='auto'
													/>
												</a>
											</Box>
										</Box>
									</Grid>
									<Grid item xs={6} className='d-center'>
										<img
											alt='Download App'
											src={`${
												prefs?.find(
													(v) =>
														v.field ===
														"qr_code_image_url"
												)?.image
											}`}
											width='80%'
											// height='50%'
										></img>
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

export default DownloadApp;
