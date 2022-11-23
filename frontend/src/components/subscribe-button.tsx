import { Grid, Typography } from "@mui/material";
import { ChevronRightOutlined } from "@mui/icons-material";
import "./component.scss";
import { ChangeEvent, useState } from "react";
import { AxiosError } from "axios";
import { ISuccess } from "@types";
import api, { Routes } from "@api";
import { useAlert } from "@hooks";
import Constants from "@constants";

const SubscribeButton = () => {
	const showAlert = useAlert();

	const [email, setEmail] = useState<string>("");

	const subscribeNewsletter = async () => {
		try {
			if (email === "") {
				showAlert("warning", "Field Empty", "Email cannot be blank");
				return;
			} else if (!Constants.EMAIL_REGEX.test(email)) {
				showAlert(
					"warning",
					"Invalid Email",
					"Please enter a valid email"
				);
				return;
			}

			const res = await api.post<ISuccess>(
				Routes.NEWSLETTER_SUBSCRIPTION,
				{
					email,
				}
			);

			if (res.status === 200) {
				showAlert("success", "Success", res.data?.result);
			}
		} catch (error) {
			const err = error as AxiosError<ISuccess>;
			console.log(err.response);
			showAlert("error", "Error", err?.response?.data?.message);
		}
	};

	return (
		<Grid
			container
			justifyContent='center'
			className='subscribe-button-container'
			mt={5}
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
					<Grid item xs={10} md={8} className='subscribe-button'>
						<Grid container>
							<Grid item xs={6} sm={8}>
								<input
									placeholder='Email Address'
									className='no-outline'
									type='text'
									value={email}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => setEmail(e?.target?.value)}
								/>
							</Grid>
							<Grid
								item
								xs={6}
								sm={4}
								sx={{
									cursor: "pointer",
								}}
								onClickCapture={(e) => {
									e.preventDefault();
									console.log("Subscribe Newsletter");
									subscribeNewsletter();
								}}
							>
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
