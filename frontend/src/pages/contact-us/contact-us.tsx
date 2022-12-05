//****************************************************************All imports go here!***************************************************************
import api, { Routes } from "@api";
import { CustomInput } from "@components";
import Button from "@components/button";
import { useAlert } from "@hooks";
import { Email } from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import { IError, IResponse, ISuccess } from "@types";
import { AxiosError } from "axios";
import { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";
import "./contact-us.scss";

//****************************************************************All imports ends here!***************************************************************

const ContactUs = () => {
	const showAlert = useAlert();
	const prefs = useAppSelector((state) => state.preferences);
	const user = useAppSelector((state) => state.user);

	const [email, setEmail] = useState<string>(user?.email ?? "");
	const [phone, setPhone] = useState<string>(user?.phone ?? "");

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
				//Resetting form
				e.target.reset();
				setEmail("");
				setPhone("");

				const msg =
					prefs?.contact_us_message?.value ?? res.data?.message;

				Swal.fire({
					title: "Success",
					text: msg,
					icon: "success",
					allowOutsideClick: () => true,
				});
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
		<Grid container className='d-center'>
			<Grid container className='contact-us-container'>
				<Grid item xs={12} sm={12} md={6}>
					<Typography
						variant='h2'
						color='var(--website-secondary-color)'
					>
						Contact Us
					</Typography>
				</Grid>
			</Grid>
			<form
				onSubmitCapture={(e: ChangeEvent<HTMLFormElement>) => {
					e.preventDefault();
					submitForm(e);
				}}
			>
				<Grid container className='input-container d-center'>
					<Grid
						item
						xs={12}
						sm={10}
						md={6}
						xl={4}
						className='input-items'
					>
						<Grid container className='input d-center'>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
								className='w-100'
							>
								<Typography
									color='var(--website-secondary-color)'
									mb={1}
								>
									Full Name
								</Typography>
								<CustomInput
									required
									placeholder='Enter Your Full Name'
									className='no-outline input-area'
									type='text'
									name='full_name'
									errors={errors?.full_name}
									defaultValue={user?.full_name ?? ""}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								display='flex'
								flexDirection='column'
								className='w-100'
							>
								<Typography
									color='var(--website-secondary-color)'
									mb={1}
								>
									Email Address
								</Typography>
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
								className='w-100'
							>
								<Typography
									color='var(--website-secondary-color)'
									mb={1}
								>
									Phone Number
								</Typography>
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
								className='w-100'
							>
								<Typography
									color='var(--website-secondary-color)'
									mb={1}
								>
									Subject
								</Typography>
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
								className='w-100'
							>
								<Typography
									color='var(--website-secondary-color)'
									mb={1}
								>
									Your Message
								</Typography>
								<textarea
									required
									placeholder='Describe Your Issue'
									className='no-outline input-area'
									name='message'
								/>
							</Grid>
							<Grid item xs={12} sm={8}>
								<Grid container>
									<Grid
										item
										xs={12}
										flexDirection='column'
										className='d-center w-100'
									>
										<Button
											style={{
												marginBottom: "20px",
												border: "none",
												width: "100%",
												textAlign: "center",
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
										<a href={`tel:${prefs?.phone?.value}`}>
											<Grid container className='call-us'>
												<PhoneIcon />
												Call On: {prefs?.phone?.value}
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
										<a
											href={`mailto:${prefs?.email?.value}`}
										>
											<Grid container className='call-us'>
												<Email />
												Email: {prefs?.email?.value}
											</Grid>
										</a>
									</Grid>
								</Grid>
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
