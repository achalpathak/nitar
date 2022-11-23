//****************************************************************All imports go here!***************************************************************
import Button from "@components/button";
import { Box, Grid, Typography } from "@mui/material";
import "./plans.scss";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SubscribeButton from "@components/subscribe-button";

//****************************************************************All imports ends here!***************************************************************

const Plans = () => {
	const data = [
		{
			price: 49,
			name: "Starter",
		},
		{
			price: 49,
			name: "Starter",
		},
		{
			price: 49,
			name: "Starter",
		},
		{
			price: 49,
			name: "Starter",
		},
		{
			price: 49,
			name: "Starter",
		},
	];
	return (
		<Grid container>
			<Grid container className='plans-container'>
				<Grid item xs={12} sm={12} md={6}>
					<Typography variant='h2'>Our Subscription Plan</Typography>
					<Typography>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Est et sollicitudin velit laoree
					</Typography>
				</Grid>
			</Grid>
			<Grid container className='plans-card'>
				{data?.map((d, i) => (
					<Grid
						key={i}
						item
						xs={8}
						sm={5}
						md={3}
						xl={2}
						className='card'
						sx={{
							margin: {
								sm: "0 5px",
							},
							marginBottom: {
								sm: 5,
							},
						}}
					>
						<Grid container>
							<Grid item className='plans-card-items'>
								<Typography variant='h5'>{d?.name}</Typography>
								<Box>
									<CurrencyRupeeIcon />
									{d?.price}
									<span>/Week</span>
								</Box>
							</Grid>
							<Grid item className='plans-card-list'>
								<ul>
									<li>
										<CheckCircleOutlineIcon color='success' />{" "}
										Unlimited Streaming
									</li>
									<li>
										<CancelOutlinedIcon className='cancel-icon' />{" "}
										Unlimited Downloads
									</li>
									<li>
										<CancelOutlinedIcon className='cancel-icon' />{" "}
										4K downloading
									</li>
									<li>
										<CancelOutlinedIcon className='cancel-icon' />{" "}
										Watch on 3 screens at the same time
									</li>
									<li>
										<CheckCircleOutlineIcon color='success' />{" "}
										Advertisement free entertainment
									</li>
								</ul>
							</Grid>
							<Grid item className='buy-now'>
								<Button title='BUY NOW' />
							</Grid>
						</Grid>
					</Grid>
				))}
				{/* <Grid item xs={12} sm={12} md={3}>r</Grid>
                <Grid item xs={12} sm={12} md={3}>a</Grid>
                <Grid item xs={12} sm={12} md={3}>f</Grid> */}
			</Grid>
			<Grid container xs={12} sm={12} md={12} className='d-center'>
				<Grid item xs={12} sm={12} md={10} className='description'>
					<Typography variant='h5'>Something Description</Typography>
					<span>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Maecenas dignissim turpis nulla urna. Ornare aliquam
						lectus nunc, lorem euismod. Eu, dictum integer tempor,
						rhoncus vitae viverra lacus. Congue tellus et cras
						egestas ultrices vel dolor. Neque tellus, enim in nullam
						amet vitae. Tellus nibh et consectetur nunc, bibendum
						tristique. Commodo massa, etiam id lacus. Pharetra
						semper vitae sapien risus curabitur ut.
					</span>
				</Grid>
				<Grid item xs={12} sm={12} md={12}>
					<SubscribeButton />
				</Grid>
			</Grid>
		</Grid>
	);
};
export default Plans;
