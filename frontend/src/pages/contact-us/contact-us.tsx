//****************************************************************All imports go here!***************************************************************
import Button from "@components/button";
import { Box, Grid, Typography } from "@mui/material";
import "./contact-us.scss";
import PhoneIcon from "@mui/icons-material/Phone";
import { ChangeEvent, FormEvent, useState } from "react";
import { AxiosError } from "axios";
import api, { Routes } from "@api";
import { CustomInput } from "@components";
import { useAlert } from "@hooks";
import { IError, IResponse, ISuccess } from "@types";
import Constants from "@constants";
import { Email } from "@mui/icons-material";

//****************************************************************All imports ends here!***************************************************************

const ContactUs = () => {
	const showAlert = useAlert();

	const [email, setEmail] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	const [errors, setErrors] = useState<IError>({
		full_name: [],
		email: [],
		phone: [],
		subject: [],
		message: [],
	});

	const submitForm = async (e: ChangeEvent<HTMLFormElement>) => {
		try {
			const f = new FormData(e.target);
			setErrors({
				full_name: [],
				email: [],
				phone: [],
				subject: [],
				message: [],
			});

			if (email === "" && phone === "") {
				showAlert(
					"warning",
					"Fields Empty",
					"Please fill email or phone"
				);
				return;
			}

			const res = await api.post<ISuccess>(Routes.CONTACT_US, {
				full_name: f.get("full_name"),
				email: email,
				phone: phone,
				subject: f.get("subject"),
				message: f.get("message"),
			});

			if (res.status === 200) {
				showAlert("success", "Success", res.data?.message);
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			const data = err?.response?.data;
			if (data?.message) {
				showAlert("error", "Error", data?.message);
			} else if (data) {
				setErrors(data);
			}
		}
	};

	return (
		<Grid container>
			<Grid container className='contact-us-container'>
				<Grid item xs={12} sm={12} md={6}>
					<Typography variant='h2'>Contact Us</Typography>
				</Grid>
			</Grid>
			<form
				onSubmitCapture={(e: ChangeEvent<HTMLFormElement>) => {
					e.preventDefault();
					submitForm(e);
				}}
			>
				<Grid container className='input-container d-center'>
					<Grid item xs={12} sm={12} md={6} className='input-items'>
						<Grid container className='input'>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
							>
								<Typography>Full Name</Typography>
								<CustomInput
									required
									placeholder='Enter Your Full Name'
									className='no-outline input-area'
									type='text'
									name='full_name'
									errors={errors?.full_name}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
							>
								<Typography>Email Address</Typography>
								<CustomInput
									placeholder='Enter Your Email Address'
									className='no-outline input-area'
									type='text'
									value={email}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => {
										setEmail(e.target.value);
									}}
									errors={errors?.email}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
							>
								<Typography>Phone Number</Typography>
								<CustomInput
									placeholder='Enter Your Phone Number'
									className='no-outline input-area'
									type='number'
									value={phone}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => {
										const phoneNum = e.target.value;
										if (phoneNum.length <= 10) {
											setPhone(e.target.value);
										}
									}}
									errors={errors?.phone}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
							>
								<Typography>Subject</Typography>
								<CustomInput
									required
									placeholder='Enter Subject'
									className='no-outline input-area'
									type='text'
									name='subject'
									errors={errors?.subject}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
							>
								<Typography>Your Message</Typography>
								<textarea
									required
									placeholder='Describe Your Issue'
									className='no-outline input-area'
									name='message'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
							>
								<Button
									style={{
										width: "20rem",
										marginBottom: "20px",
										border: "none",
									}}
									title='SUBMIT NOW'
									type='submit'
								/>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
								className='call-button'
								mb={2}
							>
								<a href='tel:001234567890'>
									<Grid container className='call-us'>
										<PhoneIcon />
										Call On: 00 1234567890
									</Grid>
								</a>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
								className='call-button'
							>
								<a href='mailto:info@taak.in'>
									<Grid container className='call-us'>
										<Email />
										Email: info@taak.in
									</Grid>
								</a>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>
			<Grid container></Grid>
		</Grid>
	);
};

export default ContactUs;
