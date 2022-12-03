//*All imports go here!
import api, { Routes } from "@api";
import logo from "@assets/common/logo.png";
import { Button, CustomInput } from "@components";
import { useAlert } from "@hooks";
import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Typography,
} from "@mui/material";
import {
	ICountryList,
	ICustomSelectOption,
	IError,
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
import makeAnimated from "react-select/animated";
import "../login/Login.scss";

const animatedComponents = makeAnimated();

const Register = () => {
	const navigate = useNavigate();
	const showAlert = useAlert();

	// * --- states start here ----------////
	const [phone, setPhone] = useState<string>("");

	//Register
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [ageRequirement, setAgeRequirement] = useState<boolean>(false);
	const [termsAndConditions, setTermsAndConditions] =
		useState<boolean>(false);

	const [countries, setCountries] = useState<ICountryList[]>([]);
	const [country, setCountry] = useState<ICountryList>({} as ICountryList);

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
					setCountry(
						res.data?.result?.find((v) => v.name === "India")
					);
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
				phone_code: country?.code,
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
			<Box className='main-container'>
				<Box className='login-container'>
					<Box className='logo-container' my={1}>
						<img
							alt='logo'
							src={logo}
							width='100%'
							height='100%'
						></img>
					</Box>
					<Box className='input-container' my={1}>
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
								noOptionsMessage={() => (
									<Box>No results found</Box>
								)}
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
							</Box>
						</>
					</Box>
					<Box className='btn-container' my={1}>
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
					</Box>
				</Box>
			</Box>
		</>
	);
};
export default Register;
