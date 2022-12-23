//*All imports go here!
import api, { Routes } from "@api";
import { Button, CustomInput } from "@components";
import { useAlert } from "@hooks";
import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	Typography,
} from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import { ICountryList, IError, IResponse, ISuccess } from "@types";
import { CustomSelectUtils } from "@utils";
import { AxiosError } from "axios";
import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../login/Login.scss";

const animatedComponents = makeAnimated();

const Register = () => {
	const navigate = useNavigate();
	const showAlert = useAlert();
	const prefs = useAppSelector((state) => state.preferences);

	// * --- states start here ----------////
	const [phone, setPhone] = useState<string>("");

	//Register
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const [ageRequirement, setAgeRequirement] = useState<boolean>(false);
	const [termsAndConditions, setTermsAndConditions] =
		useState<boolean>(false);

	const [countries, setCountries] = useState<ICountryList[]>([]);
	const [country, setCountry] = useState<ICountryList>({} as ICountryList);

	const initialErrorState: IError = {
		full_name: [],
		email: [],
		phone: [],
		age: [],
		password: [],
		confirmPassword: [],
	};

	const [errors, setErrors] = useState<IError>(initialErrorState);

	const [ageError, setAgeError] = useState<boolean>(false);
	const [termsError, setTermsError] = useState<boolean>(false);

	// * --- states ends here ----------////
	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<ICountryList[]>>(
					Routes.COUNTRY_LIST
				);

				if (res.status === 200) {
					setCountries(res.data?.result);
					const india = res.data?.result?.find(
						(v) => v.name === "India"
					);
					if (india) {
						setCountry(india);
					}
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

		if (!password) {
			setErrors((val) => ({
				...val,
				password: ["Password cannot be empty"],
			}));
		}
		if (!confirmPassword) {
			setErrors((val) => ({
				...val,
				confirmPassword: ["Confirm Password cannot be empty"],
			}));
		}
		if (password && confirmPassword) {
			if (password?.length < 4) {
				setErrors((val) => ({
					...val,
					password: [
						"Password length cannot be less than 4 characters",
					],
				}));
			} else if (password !== confirmPassword) {
				setErrors((val) => ({
					...val,
					confirmPassword: [
						"Password and Confirm Password do not match",
					],
				}));
			}
		}
		return (
			ageRequirement &&
			termsAndConditions &&
			password &&
			confirmPassword &&
			password === confirmPassword
		);
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
			setErrors(initialErrorState);

			if (!errorHandler()) {
				return;
			}
			const res = await api.post<IResponse>(Routes.REGISTER, {
				phone,
				full_name: name,
				email,
				phone_code: country?.code,
				password: password,
				age_above_18: ageRequirement,
				terms_conditions_agreed: termsAndConditions,
			});

			if (res.status === 200) {
				console.log("Registered");
				showAlert("success", "Success", res?.data?.message);
				setTimeout(() => {
					navigate("/login", {
						state: {
							email: email,
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
		<Grid container className='d-center'>
			<Grid
				item
				xs={11}
				md={6}
				xl={4}
				style={{
					maxWidth: "600px",
				}}
			>
				<Grid
					container
					display='flex'
					flexDirection='column'
					className='input-container w-100'
				>
					<Grid item xs={12} className='d-center'>
						<div className='logo-container d-center'>
							<img
								alt='logo'
								src={prefs?.logo_url?.image}
								width='100%'
								height='100%'
							></img>
						</div>
					</Grid>
					<Grid item xs={12} className='d-center'>
						<label
							style={{
								textAlign: "center",
							}}
						>
							Fill your details to register
						</label>
					</Grid>
					<Grid item xs={12} className='d-center flex-column'>
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
					</Grid>
					<Grid item xs={12} className='d-center flex-column'>
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
					</Grid>
					<Grid item xs={12} className='d-center flex-column'>
						<CustomInput
							type='password'
							id='password'
							name='password'
							placeholder='Enter your Password'
							value={password}
							onChangeCapture={(
								e: ChangeEvent<HTMLInputElement>
							) => {
								setPassword(e.target.value);
							}}
							errors={errors?.password}
						/>
					</Grid>
					<Grid item xs={12} className='d-center flex-column'>
						<CustomInput
							type='password'
							id='confirm-password'
							name='confirm-password'
							placeholder='Enter Confirm Password'
							value={confirmPassword}
							onChangeCapture={(
								e: ChangeEvent<HTMLInputElement>
							) => {
								setConfirmPassword(e.target.value);
							}}
							errors={errors?.confirmPassword}
						/>
					</Grid>
					<Grid item xs={12} className='d-center flex-column'>
						<Select<ICountryList, false>
							name='country'
							id='country'
							closeMenuOnSelect={true}
							className='w-100'
							components={animatedComponents}
							isMulti={false}
							isSearchable
							options={countries}
							value={country}
							onChange={(newValue) => {
								if (newValue) {
									setCountry(newValue);
								}
							}}
							noOptionsMessage={() => <Box>No results found</Box>}
							getOptionLabel={(option) =>
								`(${option.code}) ${option.name}`
							}
							getOptionValue={(option) => option.name}
							filterOption={(option, input) =>
								option.label
									?.toLowerCase()
									.includes(input?.toLowerCase())
							}
							styles={CustomSelectUtils.customStyles()}
						/>
					</Grid>
					<Grid item xs={12} className='d-center flex-column'>
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
					</Grid>
					<Grid item xs={12} className='d-center flex-column'>
						<Box className='custom-label' my={1}>
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
										<a
											href=''
											className='age'
											onClickCapture={(e) => {
												e.preventDefault();
												setAgeRequirement(
													(val) => !val
												);
											}}
											style={{
												color: "var(--website-secondary-color)",
											}}
										>
											Your age is
										</a>
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
											<a
												href=''
												onClickCapture={(e) => {
													e.preventDefault();
													setTermsAndConditions(
														(val) => !val
													);
												}}
												style={{
													color: "var(--website-secondary-color)",
												}}
											>
												You agree to the{" "}
											</a>
											<Link
												to='/terms-and-conditions'
												target='_blank'
												style={{
													textDecoration: "underline",
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
						</Box>
					</Grid>
					<Grid item xs={12} className='d-center'>
						<Button
							title={"REGISTER"}
							onClickCapture={async (
								e: MouseEvent<HTMLButtonElement>
							) => {
								e.preventDefault();
								register();
							}}
						/>
					</Grid>
					<Grid item xs={12} className='d-center'>
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
					</Grid>
					<Grid item xs={12} className='d-center'>
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
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};
export default Register;
