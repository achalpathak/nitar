//*All imports go here!
import "./Login.scss";
// import logo from "@assets/common/logo.png";
import api, { Routes } from "@api";
import { Button, CustomInput } from "@components";
import { useAlert } from "@hooks";
import { Alert, AlertTitle, Typography } from "@mui/material";
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
		phone: string;
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
		location?.state?.phone ? "otp" : "login"
	);
	const [otp, setOtp] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

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

	const sendOtp = async (phoneNum: string = phone) => {
		try {
			if (location?.state?.phone) {
				location.state.phone = "";
			}

			const res = await api.post<IResponse>(Routes.SEND_OTP, {
				phone: phoneNum,
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
				phone,
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
			sendOtp(location?.state?.phone);
		}
	}, []);

	return (
		<>
			<div className='main-container'>
				<div className='login-container'>
					<div className='logo-container'>
						<img
							alt='logo'
							src={prefs?.logo_url?.image}
							width='100%'
							height='100%'
						></img>
					</div>
					<div className='input-container'>
						{process === "login" && (
							<>
								<label>
									Enter your phone number below to continue
								</label>
								<CustomInput
									type='number'
									id='phone-number'
									name='phone-number'
									placeholder='Enter your phone number'
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
							</>
						)}
						{process === "otp" && (
							<>
								<label>
									Enter verification code sent on your mobile
									number
								</label>
								<OtpInput
									value={otp}
									onChange={setOtp}
									numInputs={6}
									// isInputSecure={true}
									inputStyle={{
										width: "2rem",
										height: "2rem",
										padding: 5,
										backgroundSize: "cover",
									}}
									className='otp-container'
									isInputNum
								/>
							</>
						)}
					</div>
					<div
						className='btn-container'
						style={{ marginTop: "15px" }}
					>
						<Button
							title={process === "login" ? "CONTINUE" : "VERIFY"}
							style={{
								marginBottom: "1rem",
							}}
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
						{process === "login" ? (
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
						) : null}
						{process === "otp" && (
							<>
								<Button
									title={"Resend OTP"}
									onClickCapture={async (e) => {
										e.preventDefault();
										sendOtp();
									}}
									disabled={timer > 0}
									style={{ margin: "1rem 0" }}
								/>
								<Typography
									component='label'
									textAlign='center'
								>
									You can resend the OTP in {timer} seconds
								</Typography>
							</>
						)}
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
};
export default Login;
