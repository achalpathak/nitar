//****************************************************************All imports go here!***************************************************************
import Button from "@components/button";
import { Box, Grid, Typography } from "@mui/material";
import "./contact-us.scss";
import PhoneIcon from "@mui/icons-material/Phone";

//****************************************************************All imports ends here!***************************************************************

const ContactUs = () => {
	return (
		<Grid container>
			<Grid container className='contact-us-container'>
				<Grid item xs={12} sm={12} md={6}>
					<Typography variant='h2'>Contact Us</Typography>
					<Typography>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Est et sollicitudin velit laoree
					</Typography>
				</Grid>
			</Grid>
			<Grid container className='input-container d-center'>
				<Grid item xs={12} sm={12} md={6} className='input-items'>
					<Grid container className='input'>
						<Grid item xs={12} sm={12} md={6}>
							<Typography>Full Name</Typography>
							<input
								placeholder='Enter Your Full Name'
								className='no-outline input-area'
								type='text'
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Typography>Email Address</Typography>
							<input
								placeholder='Enter Your Email Address'
								className='no-outline input-area'
								type='text'
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Typography>Phone Number</Typography>
							<input
								placeholder='Enter Your Phone Number'
								className='no-outline input-area'
								type='text'
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Typography>Subject</Typography>
							<input
								placeholder='Enter Subject'
								className='no-outline input-area'
								type='text'
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Typography>Your Message</Typography>
							<textarea
								placeholder='Describe Your Issue'
								className='no-outline input-area'
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Button title='SUBMIT NOW' />
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							mt={2}
							className='call-button'
						>
							<a href='tel:001234567890'>
								<Grid container className='call-us'>
										<PhoneIcon />
                                        Call On: 00 1234567890
								</Grid>
							</a>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid container></Grid>
		</Grid>
	);
};

export default ContactUs;
