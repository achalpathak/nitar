//*All imports go here!
import "./Login.scss";
// import logo from "@assets/common/logo.png";
import api, { Routes } from "@api";
import { Button, CustomInput } from "@components";
import { useAlert } from "@hooks";
import { Alert, Link as MLink, Grid, Typography } from "@mui/material";
import Actions from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { IError, IMessage, IResponse, IUser } from "@types";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Google } from "@assets";

type ILocationProps = {
	pathname: string;
	state: {
		email: string;
		password: string;
	};
};

const Login = () => {
	const navigate = useNavigate();

	const location: ILocationProps = useLocation();
	const showAlert = useAlert();
	const prefs = useAppSelector((state) => state.preferences);

	const dispatch = useAppDispatch();

	// * --- states start here ----------////

	const [process, setProcess] = useState<"login" | "otp">(
		location?.state?.email ? "otp" : "login"
	);
	const [otp, setOtp] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [message, setMessage] = useState<IMessage | null>(null);
	const [errors, setErrors] = useState<IError>({
		full_name: [],
		email: [],
		phone: [],
		age: [],
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

	const sendResetPasswordToken = async () => {
		try {
			const res = await api.post<IResponse>(
				Routes.FORGOT_PASSWORD_EMAIL,
				{
					email,
				}
			);

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

	const signIn = async (_email: string = email, _password = password) => {
		try {
			if (location?.state?.email) {
				location.state.email = "";
				location.state.password = "";
			}

			const res = await api.post<IResponse>(Routes.LOGIN, {
				email: _email,
				password: _password,
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
				if (data?.email?.includes("Email is not verified.")) {
					sendOtp();
				}
			}
		}
	};

	const sendOtp = async (_email: string = email) => {
		try {
			const res = await api.post<IResponse<IUser>>(Routes.SEND_OTP, {
				email: _email,
			});

			if (res.status === 200) {
				console.log("OTP Sent");
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
				email,
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
		if (location?.state?.email) {
			console.log(location);
			setEmail(location?.state?.email);
			setPassword(location?.state?.password);
			sendOtp(location?.state?.email);
		}
	}, []);

	return (
		<Grid container className='d-center'>
			<Grid
				item
				xs={10}
				sm={8}
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
					className='input-container'
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
										whiteSpace: "nowrap",
									}}
								>
									Enter your phone number below to continue
								</label>
								<CustomInput
									type='email'
									id='email'
									name='email'
									placeholder='Enter your email address'
									value={email}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => {
										setEmail(e.target.value);
									}}
									errors={errors?.email}
								/>
								<CustomInput
									type='password'
									id='password'
									name='password'
									placeholder='Enter your password'
									value={password}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => {
										setPassword(e.target.value);
									}}
									errors={errors?.password}
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
							<Grid item xs={12} className='d-center'>
								<Typography mt={1}>
									<>
										Forgot your password?{" "}
										<MLink
											href='#'
											onClickCapture={(e) => {
												e.preventDefault();
												sendResetPasswordToken();
											}}
											style={{
												color: "var(--website-primary-color)",
											}}
										>
											Reset
										</MLink>
									</>
								</Typography>
							</Grid>
						</>
					) : (
						<Grid item xs={12} className='d-center flex-column'>
							<label>
								Enter verification code sent on your email
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
									await signIn();
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
						<Button
							title={"Cancel"}
							onClickCapture={async (e) => {
								e.preventDefault();
								stopTimer();
								if (process === "login") {
									navigate("/");
								} else {
									setProcess("login");
								}
							}}
							style={{ margin: "1rem 0" }}
						/>
					</Grid>
					{/* <Grid item xs={12} className='d-center'>
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
					</Grid> */}
				</Grid>
			</Grid>
		</Grid>
	);
};
export default Login;
