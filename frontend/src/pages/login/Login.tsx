//*All imports go here!
import "./Login.scss";
// import logo from "@assets/common/logo.png";
import api, { Routes } from "@api";
import { Button, CustomInput } from "@components";
import { useAlert } from "@hooks";
import { Alert, Link as MLink, Grid, Typography, Box } from "@mui/material";
import Actions from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
	ICountryList,
	IError,
	IMessage,
	IResponse,
	ISuccess,
	IUser,
} from "@types";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Google } from "@assets";
import { CustomSelectUtils } from "@utils";
import Select from "react-select";
import makeAnimated from "react-select/animated";

type ILocationProps = {
	pathname: string;
	state: {
		phone: string;
		phone_code: string;
		type: "email" | "phone" | "";
		message: string;
	};
};

const animatedComponents = makeAnimated();

const Login = () => {
	const navigate = useNavigate();

	const location: ILocationProps = useLocation();
	const showAlert = useAlert();
	const prefs = useAppSelector((state) => state.preferences);

	const dispatch = useAppDispatch();

	// * --- states start here ----------////

	const [process, setProcess] = useState<"login" | "otp">(
		location?.state?.phone ? "otp" : "login"
	);
	const [otp, setOtp] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [phoneCode, setPhoneCode] = useState<string>("");
	const [otpType, setOtpType] = useState<"email" | "phone" | "">("");
	const [countries, setCountries] = useState<ICountryList[]>([]);
	const [country, setCountry] = useState<ICountryList>({} as ICountryList);

	const [errors, setErrors] = useState<IError>({
		phone: [],
		phone_code: [],
	});

	const interval = useRef<NodeJS.Timer>();
	const [timer, setTimer] = useState<number>(60);

	const loading = useAppSelector((state) => state.loading);

	// * --- states ends here ----------////

	const startTimer = () => {
		setTimer(60);
		const id = setInterval(() => {
			setTimer((t) => t - 1);
		}, 1000);

		interval.current = id;
	};

	const stopTimer = () => {
		clearInterval(interval.current);
		interval.current = undefined;
	};

	useEffect(() => {
		return () => stopTimer();
	}, []);

	useEffect(() => {
		if (timer <= 0) {
			stopTimer();
		}
	}, [timer]);

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
						setPhoneCode(india.code);
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

	const sendOtp = async (
		_phone: string = phone,
		_phone_code: string = phoneCode
	) => {
		if (location?.state?.phone) {
			location.state.phone = "";
			location.state.phone_code = "";
			location.state.type = "";
		}

		try {
			const res = await api.post<IResponse<IUser>>(Routes.SEND_OTP, {
				phone: parseInt(_phone),
				phone_code: _phone_code,
			});

			if (res.status === 200) {
				console.log("OTP Sent");
				setOtpType(
					res.data?.message?.includes("email") ? "email" : "phone"
				);
				setProcess("otp");
				showAlert("success", "Success", res?.data?.message);

				startTimer();
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

	const verifyOtp = async () => {
		try {
			const res = await api.post<IResponse<IUser>>(Routes.VERIFY_OTP, {
				phone: parseInt(phone),
				phone_code: phoneCode,
				otp: parseInt(otp),
			});

			if (res.status === 200) {
				showAlert("success", "Success", "Login Successful");
				dispatch({
					type: Actions.LOGIN,
					payload: res.data?.result,
				});
				navigate("/");
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

	//? If login is redirected from register -> Send OTP
	useEffect(() => {
		if (location?.state?.phone) {
			console.log(location);
			setPhone(location?.state?.phone);
			setPhoneCode(location?.state?.phone_code);
			setOtpType(location?.state?.type);

			// Otp is send using backend for register flow
			showAlert("success", "Success", location?.state?.message);

			startTimer();
		}
	}, []);

	return (
		<Grid container className='d-center'>
			<Grid
				item
				xs={10}
				md={4}
				xl={4}
				style={{
					maxWidth: "600px",
				}}
			>
				<Grid
					container
					display='flex'
					flexDirection='column'
					className='input-container d-center'
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
					{process === "login" ? (
						<>
							<Grid item xs={12} className='d-center flex-column'>
								<label
									style={{
										textAlign: "center",
									}}
								>
									Enter your phone number below to continue
								</label>
								<>
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
												setPhoneCode(newValue?.code);
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
									{errors?.phone_code &&
										errors?.phone_code?.length > 0 &&
										errors?.phone_code?.map((v) => (
											<span className='error' key={v}>
												{v}
											</span>
										))}
								</>
								<CustomInput
									type='number'
									id='phone'
									name='phone'
									placeholder='Enter your phone number'
									value={phone}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => {
										setPhone(e.target.value);
									}}
									errors={errors?.phone}
								/>
							</Grid>
							<Grid item xs={12} mt={2} className='d-center'>
								<Typography mt={1}>
									<>
										Don't have an account?{" "}
										<Link
											to='/register'
											style={{
												color: "var(--website-primary-color)",
											}}
										>
											Register
										</Link>
									</>
								</Typography>
							</Grid>
						</>
					) : (
						<Grid item xs={12} className='d-center flex-column'>
							<label>
								Enter verification code sent on your {otpType}
							</label>
							<OtpInput
								value={otp}
								onChange={setOtp}
								numInputs={6}
								inputStyle={{
									width: "3rem",
									height: "3rem",
									padding: 5,
									backgroundSize: "cover",
								}}
								className='otp-container'
								isInputNum
							/>
						</Grid>
					)}
					<Grid item xs={12} mt={2} className='d-center'>
						<Button
							title={process === "login" ? "CONTINUE" : "VERIFY"}
							onClickCapture={async (e) => {
								e.preventDefault();
								if (process === "login") {
									await sendOtp();
								} else if (process === "otp") {
									verifyOtp();
								}
							}}
							disabled={loading}
						/>
					</Grid>
					{process === "login" ? (
						<Grid item xs={12} mt={2} className='d-center'>
							<a
								href={Routes.LOGIN_WITH_GOOGLE}
								target='_self'
								className='sign-in-with-google d-center'
							>
								<Google
									style={{
										marginRight: "1rem",
									}}
								/>
								Login with Google
							</a>
						</Grid>
					) : (
						<>
							<Grid item xs={12} className='d-center'>
								<Button
									title={"Resend OTP"}
									onClickCapture={async (e) => {
										e.preventDefault();
										sendOtp();
									}}
									disabled={timer > 0}
									style={{ margin: "1rem 0" }}
								/>
							</Grid>
							<Grid item xs={12}>
								<Typography
									component='label'
									textAlign='center'
								>
									You can resend the OTP in {timer} seconds
								</Typography>
							</Grid>
						</>
					)}
					<Grid item xs={12} className='d-center'>
						<button
							className='cancel-btn'
							onClickCapture={(e) => {
								e.preventDefault();
								stopTimer();
								if (process === "login") {
									navigate("/");
								} else {
									setProcess("login");
								}
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
export default Login;
