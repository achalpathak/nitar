//*All imports go here!
import "../login/Login.scss";
import logo from "@assets/common/logo.png";
import { Button, CustomInput } from "@components";
import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useState,
} from "react";
import { AxiosError } from "axios";
import api from "@api";
import {
	Alert,
	AlertColor,
	AlertTitle,
	Checkbox,
	FormControlLabel,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { IMessage, IResponse, IError } from "@types";

const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Register = () => {
	const navigate = useNavigate();

	// * --- states start here ----------////

	const [otp, setOtp] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	//Register
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dob, setDob] = useState<string>("");
	const [ageRequirement, setAgeRequirement] = useState<boolean>(true);
	const [termsAndConditions, setTermsAndConditions] = useState<boolean>(true);

	const [message, setMessage] = useState<IMessage | null>(null);

	const [errors, setErrors] = useState<IError>({
		full_name: [],
		email: [],
		phone: [],
		age: [],
	});

	// * --- states ends here ----------////

	const addMessage = (
		severity: AlertColor,
		title: string,
		description: string = ""
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

	const getAge = (dateString: string = dob) => {
		var today = new Date();
		var birthDate = new Date(dateString);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	// const errorHandler = () => {
	// 	const tError: IError = {
	// 		full_name: [],
	// 		email: [],
	// 		phone: [],
	// 		age: [],
	// 	};
	// 	if (!name) {
	// 		tError.full_name?.push("Name cannot be blank");
	// 	}

	// 	if (!email) {
	// 		tError.email?.push("Email cannot be blank");
	// 	} else if (!EMAIL_REGEX.test(email)) {
	// 		tError.email?.push("Email Id is not valid");
	// 	}

	// 	if (!phone) {
	// 		tError.phone?.push("Phone cannot be blank");
	// 	} else if (phone.length !== 10 || isNaN(parseInt(phone))) {
	// 		tError.phone?.push("Phone number should be 10 digits");
	// 	}

	// 	if (!dob) {
	// 		tError.age?.push("Date of Birth cannot be blank");
	// 	} else if (getAge() < 18) {
	// 		tError.age?.push("Minimum age must be 18 years");
	// 	}
	// 	setErrors(tError);

	// 	return Object.values(tError).every((e) => e.length === 0);
	// };

	//? ----Checking if the input is number-----
	const checkIfNumber = (event: KeyboardEvent<HTMLInputElement>) => {
		/**
		 * Allowing: Integers | Backspace | Tab | Delete | Left & Right arrow keys
		 **/

		const regex = new RegExp(
			/(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/
		);

		return !event.key.match(regex) && event.preventDefault();
	};

	const register = async () => {
		try {
			const res = await api.post<IResponse>("/api/users/register/", {
				phone,
				full_name: name,
				email,
				age: getAge(dob) ?? "",
				age_above_18: ageRequirement,
				terms_conditions_agreed: termsAndConditions,
			});

			if (res.status === 200) {
				console.log("Registered");
				addMessage("success", "Success", res?.data?.message);
				setTimeout(() => {
					navigate("/login", {
						state: {
							phone: phone,
						},
					});
				}, 2000);
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			const data = err?.response?.data;
			if (data?.message) {
				addMessage("error", "Error", data?.message);
			} else if (data) {
				setErrors(data);
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
							<CustomInput
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
								errors={errors?.full_name}
							/>
							<CustomInput
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
								errors={errors?.email}
							/>
							<CustomInput
								type='number'
								id='phone'
								name='phone'
								placeholder='Enter your Phone Number'
								value={phone}
								onChangeCapture={(
									e: ChangeEvent<HTMLInputElement>
								) => {
									const phoneNum = e.target.value;
									if (
										phoneNum.length <= 10 &&
										!isNaN(parseInt(phoneNum))
									) {
										setPhone(phoneNum);
									}
								}}
								errors={errors?.phone}
							/>
							<CustomInput
								type='text'
								id='dob'
								name='dob'
								placeholder='Your Date Of Birth (DD/MM/YYYY)'
								onChangeCapture={(
									e: ChangeEvent<HTMLInputElement>
								) => {
									setDob(e.target.value);
								}}
								onFocusCapture={(e) => {
									e.target.type = "date";
								}}
								onBlurCapture={(e) => {
									e.target.type = "text";
								}}
								errors={errors?.age}
							/>
							<div className='custom-label'>
								<FormControlLabel
									control={
										<Checkbox
											checked={ageRequirement}
											onChangeCapture={(e) => {
												setAgeRequirement(
													(val) => !val
												);
											}}
										/>
									}
									label='Your age is above 18 years'
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={termsAndConditions}
											onChangeCapture={(e) => {
												setTermsAndConditions(
													(val) => !val
												);
											}}
										/>
									}
									label={
										<span>
											You agree to the{" "}
											<Link
												to='/terms-and-conditions'
												target='_blank'
											>
												Terms & Conditions
											</Link>
										</span>
									}
								/>
							</div>
						</>
					</div>
					<div className='btn-container'>
						<Button
							title={"REGISTER"}
							onClickCapture={async (
								e: MouseEvent<HTMLButtonElement>
							) => {
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
						{message?.description}
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
