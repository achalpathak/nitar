//*All imports go here!
import api, { Routes } from "@api";
import logo from "@assets/common/logo.png";
import { Button, CustomInput } from "@components";
import { useAlert } from "@hooks";
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Typography,
} from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import {
	ICountryList,
	ICustomSelectOption,
	IError,
	IMessage,
	IResponse,
	ISuccess,
} from "@types";
import { CustomSelectUtils } from "@utils";
import axios, { AxiosError } from "axios";
import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../login/Login.scss";

const Register = () => {
	const navigate = useNavigate();
	const showAlert = useAlert();

	const user = useAppSelector((state) => state.user);

	if (user?.full_name) {
		navigate("/");
	}

	// * --- states start here ----------////

	const [otp, setOtp] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	//Register
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dob, setDob] = useState<string>("");
	const [ageRequirement, setAgeRequirement] = useState<boolean>(false);
	const [termsAndConditions, setTermsAndConditions] =
		useState<boolean>(false);

	const [countries, setCountries] = useState<ICountryList[]>([]);
	const [country, setCountry] = useState<string>("India");

	const [errors, setErrors] = useState<IError>({
		full_name: [],
		email: [],
		phone: [],
		age: [],
	});

	const [ageError, setAgeError] = useState<boolean>(false);
	const [termsError, setTermsError] = useState<boolean>(false);

	// * --- states ends here ----------////

	// const addMessage = (
	// 	severity: AlertColor,
	// 	title: string,
	// 	description: string = ""
	// ) => {
	// 	setMessage({
	// 		severity,
	// 		title,
	// 		description,
	// 	});
	// 	setTimeout(() => {
	// 		setMessage(null);
	// 	}, 4000);
	// };

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get<ISuccess<ICountryList[]>>(
					Routes.COUNTRY_LIST
				);

				if (res.status === 200) {
					setCountries(res.data?.result);
				} else {
					setCountries([]);
				}
			} catch (error) {
				const err = error as AxiosError<IResponse>;
				console.error(err.response);
				setCountries([]);
			}
		})();
	}, []);

	const errorHandler = () => {
		if (!ageRequirement) {
			setAgeError(true);
		}
		if (!termsAndConditions) {
			setTermsError(true);
		}

		return ageRequirement && termsAndConditions;
	};

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
			if (!errorHandler()) {
				return;
			}
			const res = await api.post<IResponse>("/api/users/register/", {
				phone,
				full_name: name,
				email,
				country: countries?.find((c) => c.name === country)?.code,
				age_above_18: ageRequirement,
				terms_conditions_agreed: termsAndConditions,
			});

			if (res.status === 200) {
				console.log("Registered");
				showAlert("success", "Success", res?.data?.message);
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
				showAlert("error", "Error", data?.message);
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
							<Select<ICustomSelectOption, false>
								name='country'
								id='country'
								closeMenuOnSelect={true}
								className='w-100'
								isMulti={false}
								isSearchable
								options={CustomSelectUtils.convertToSelectOption(
									countries,
									"name"
								)}
								value={CustomSelectUtils.getDefaultValue(
									country
								)}
								onChange={(newValue) => {
									if (newValue) {
										setCountry(newValue?.value);
									}
								}}
								getOptionLabel={(option) => option.label}
								getOptionValue={(option) => option.value}
								noOptionsMessage={() => (
									<div>No results found</div>
								)}
								styles={CustomSelectUtils.customStyles()}
							/>
							<div className='custom-label'>
								<FormControl error={ageError} margin='none'>
									<FormControlLabel
										control={
											<Checkbox
												sx={{
													color: "var(--website-secondary-color)",
													"&.Mui-checked": {
														color: "var(--website-primary-color)",
													},
												}}
												checked={ageRequirement}
												onChangeCapture={(e) => {
													setAgeRequirement(
														(val) => !val
													);
													if (ageError) {
														setAgeError(false);
													}
												}}
											/>
										}
										label={
											<span className='age'>
												Your age is
											</span>
										}
									/>
									{ageError && (
										<FormHelperText>
											Please click checkbox to continue
										</FormHelperText>
									)}
								</FormControl>
								<FormControl error={termsError}>
									<FormControlLabel
										control={
											<Checkbox
												sx={{
													color: "var(--website-secondary-color)",
													"&.Mui-checked": {
														color: "var(--website-primary-color)",
													},
												}}
												checked={termsAndConditions}
												onChangeCapture={(e) => {
													setTermsAndConditions(
														(val) => !val
													);

													if (termsError) {
														setTermsError(false);
													}
												}}
											/>
										}
										label={
											<span>
												You agree to the{" "}
												<Link
													to='/terms-and-conditions'
													target='_blank'
													style={{
														textDecoration:
															"underline",
														color: "var(--website-primary-color)",
													}}
												>
													Terms & Conditions
												</Link>
											</span>
										}
									/>
									{termsError && (
										<FormHelperText>
											Please accept terms and conditions
										</FormHelperText>
									)}
								</FormControl>
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
						<Typography mt={2}>
							<>
								Already have an account?{" "}
								<Link
									to='/login'
									style={{
										color: "var(--website-primary-color)",
									}}
								>
									Login
								</Link>
							</>
						</Typography>
						<button
							className='cancel-btn'
							onClickCapture={(e) => {
								e.preventDefault();
								navigate("/");
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
