//*All imports go here!
import "../login/Login.scss";
import logo from "@assets/common/logo.png";
import { Button } from "@components";
import { ChangeEvent, useState } from "react";
import { AxiosError } from "axios";
import api from "@api";
import {
	Alert,
	AlertColor,
	AlertTitle,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type IResponse = {
	message: string;
	phone: string[];
};

type IMessage = {
	severity: AlertColor;
	title: string;
	description?: string | string[];
};

const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Register = () => {
	const navigate = useNavigate();

	const [otp, setOtp] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	//Register
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dob, setDob] = useState<string>("");

	const [message, setMessage] = useState<IMessage | null>(null);

	const addMessage = (
		severity: AlertColor,
		title: string,
		description: string | string[] = ""
	) => {
		setMessage({
			severity,
			title,
			description,
		});
		setTimeout(() => {
			setMessage(null);
		}, 4000);
	};

	const getAge = (dateString: string) => {
		var today = new Date();
		var birthDate = new Date(dateString);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	const register = async () => {
		try {
			if (!phone || !name || !dob || !email) {
				addMessage(
					"warning",
					"Field Required",
					"Please fill all the fields"
				);
			} else if (!EMAIL_REGEX.test(email)) {
				addMessage(
					"warning",
					"Email Invalid",
					"Please enter correct email"
				);
			} else if (phone.length !== 10) {
				addMessage(
					"warning",
					"Phone Invalid",
					"Please enter 10 digit phone number"
				);
			} else {
				const res = await api.post<IResponse>("/api/users/register/", {
					phone,
					full_name: name,
					email,
					age: getAge(dob),
					terms_conditions_agreed: true,
				});

				if (res.status === 200) {
					console.log("Registered");
					addMessage("success", "Success", res?.data?.message);
					setTimeout(() => {
						navigate("/home");
					}, 3000);
				}
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			const data = err?.response?.data;
			if (data) {
				const values = Object.values(data).flat(3);
				addMessage("error", "Error", values);
			}
		}
	};

	return (
		<>
			<div className='main-container'>
				<div className='login-container'>
					<div className='logo-container'>
						<img
							alt='logo'
							src={logo}
							width='100%'
							height='100%'
						></img>
					</div>
					<div className='input-container'>
						<>
							<label>Fill your details to register</label>
							<input
								type='text'
								id='full-name'
								name='full-name'
								placeholder='Enter Your Full Name'
								value={name}
								onChangeCapture={(
									e: ChangeEvent<HTMLInputElement>
								) => {
									setName(e.target.value);
								}}
							/>
							<input
								type='email'
								id='email-address'
								name='email-address'
								placeholder='Enter your Email Address'
								value={email}
								onChangeCapture={(
									e: ChangeEvent<HTMLInputElement>
								) => {
									setEmail(e.target.value);
								}}
							/>
							<input
								type='number'
								id='phone'
								name='phone'
								placeholder='Enter your Phone Number'
								value={phone}
								onChangeCapture={(
									e: ChangeEvent<HTMLInputElement>
								) => {
									const phoneNum = e.target.value;
									console.log("Phone", phoneNum);
									if (phoneNum.length <= 10) {
										setPhone(e.target.value);
									}
								}}
							/>
							<input
								type='date'
								id='dob'
								name='dob'
								placeholder='Enter Date Of Birth (DD/MM/YYYY)'
								onChangeCapture={(
									e: ChangeEvent<HTMLInputElement>
								) => {
									setDob(e.target.value);
								}}
							/>
						</>
					</div>
					<div className='btn-container'>
						<Button
							title={"REGISTER"}
							onClickCapture={async (e) => {
								e.preventDefault();
								register();
							}}
						/>
						<button
							className='cancel-btn'
							onClickCapture={(e) => {
								e.preventDefault();
								// alert("alert");
							}}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
			<div
				className={`alert-container ${
					message !== null ? "show" : "hide"
				}`}
			>
				{message?.severity && (
					<Alert severity={message?.severity}>
						<AlertTitle>{message?.title}</AlertTitle>
						<div
							dangerouslySetInnerHTML={{
								__html:
									message?.description !== undefined
										? Array.isArray(message?.description)
											? message?.description
													?.map(
														(v) => `<div>${v}</div>`
													)
													?.join("")
											: message?.description
										: "",
							}}
						/>
					</Alert>
				)}
			</div>
		</>
	);

	// return (
	// 	<>
	// 		<Grid container alignItems='center' justifyContent='center'>
	// 			<Grid
	// 				item
	// 				xs={8}
	// 				height='72vh'
	// 				display='flex'
	// 				className='login-container'
	// 			>
	// 				<Grid container>
	// 					<Grid item mt={4} xs={12}>
	// 						<Grid item xs={4}>
	// 							<img alt='logo' src={logo} className='logo' />
	// 						</Grid>
	// 					</Grid>
	// 					<Grid
	// 						item
	// 						xs={12}
	// 						display='flex'
	// 						direction='column'
	// 						alignItems='center'
	// 						mt={2}
	// 						className='input-container'
	// 					>
	// 						<Grid item xs={12}>
	// 							<Grid>
	// 								<Typography
	// 									sx={{
	// 										typography: {
	// 											md: "h4",
	// 											sm: "h5",
	// 											xs: "h6",
	// 										},
	// 									}}
	// 									component='label'
	// 									textAlign='center'
	// 								>
	// 									Fill your details to register
	// 								</Typography>
	// 							</Grid>
	// 							<Grid>
	// 								<Grid
	// 									component='input'
	// 									mt={4}
	// 									type='text'
	// 									id='full-name'
	// 									name='full-name'
	// 									placeholder='Enter Your Full Name'
	// 									value={name}
	// 									onChangeCapture={(
	// 										e: ChangeEvent<HTMLInputElement>
	// 									) => {
	// 										setName(e.target.value);
	// 									}}
	// 								/>
	// 							</Grid>
	// 							<Grid>
	// 								<Grid
	// 									component='input'
	// 									mt={4}
	// 									type='email'
	// 									id='email-address'
	// 									name='email-address'
	// 									placeholder='Enter your Email Address'
	// 									value={email}
	// 									onChangeCapture={(
	// 										e: ChangeEvent<HTMLInputElement>
	// 									) => {
	// 										setEmail(e.target.value);
	// 									}}
	// 								/>
	// 							</Grid>
	// 							<Grid
	// 								component='input'
	// 								mt={4}
	// 								type='number'
	// 								id='phone'
	// 								name='phone'
	// 								placeholder='Enter your Phone Number'
	// 								value={phone}
	// 								onChangeCapture={(
	// 									e: ChangeEvent<HTMLInputElement>
	// 								) => {
	// 									const phoneNum = e.target.value;
	// 									console.log("Phone", phoneNum);
	// 									if (phoneNum.length <= 10) {
	// 										setPhone(e.target.value);
	// 									}
	// 								}}
	// 							/>
	// 							<Grid
	// 								component='input'
	// 								mt={4}
	// 								type='date'
	// 								id='dob'
	// 								name='dob'
	// 								placeholder='Enter Date Of Birth (DD/MM/YYYY)'
	// 								onChangeCapture={(
	// 									e: ChangeEvent<HTMLInputElement>
	// 								) => {
	// 									setDob(e.target.value);
	// 								}}
	// 							/>
	// 						</Grid>
	// 					</Grid>
	// 					{/* <Grid
	// 						className='btn-container'
	// 						display='flex'
	// 						flexDirection='column'
	// 						mt={4}
	// 					>
	// 						<Button
	// 							title={"REGISTER"}
	// 							onClickCapture={async (e) => {
	// 								e.preventDefault();
	// 								register();
	// 							}}
	// 						/>
	// 						<button
	// 							className='cancel-btn'
	// 							onClickCapture={(e) => {
	// 								e.preventDefault();
	// 								// alert("alert");
	// 							}}
	// 						>
	// 							<svg
	// 								xmlns='http://www.w3.org/2000/svg'
	// 								fill='none'
	// 								viewBox='0 0 24 24'
	// 								strokeWidth='1.5'
	// 								stroke='currentColor'
	// 								className='w-6 h-6'
	// 							>
	// 								<path
	// 									strokeLinecap='round'
	// 									strokeLinejoin='round'
	// 									d='M6 18L18 6M6 6l12 12'
	// 								/>
	// 							</svg>
	// 						</button>
	// 					</Grid> */}
	// 				</Grid>
	// 			</Grid>
	// 		</Grid>
	// 		<Grid
	// 			width='fit-content'
	// 			position='absolute'
	// 			top={0}
	// 			right={0}
	// 			mt={3}
	// 			mr={3}
	// 			className={`alert-container ${
	// 				message !== null ? "show" : "hide"
	// 			}`}
	// 		>
	// 			{message?.severity && (
	// 				<Alert severity={message?.severity}>
	// 					<AlertTitle>{message?.title}</AlertTitle>
	// 					{message?.description}
	// 				</Alert>
	// 			)}
	// 		</Grid>
	// 	</>
	// );
};
export default Register;
