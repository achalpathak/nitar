//*All imports go here!
import "./Login.scss";
import logo from "@assets/common/logo.png";
import { Button } from "@components";
import { ChangeEvent, useEffect, useState } from "react";
import OtpInput from "react-otp-input";
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
import { Box } from "@mui/system";
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

const Login = () => {
	const navigate = useNavigate();

	const [process, setProcess] = useState<"login" | "otp">("login");
	const [otp, setOtp] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

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

	const sendOtp = async () => {
		try {
			if (phone) {
				const res = await api.post<IResponse>("/api/users/send-otp/", {
					phone,
				});

				if (res.status === 200) {
					console.log("OTP Sent");
					setProcess("otp");
					addMessage("success", "Success", res?.data?.message);
				}
			} else {
				addMessage(
					"warning",
					"Field Required",
					"Phone Number cannot be blank"
				);
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

	const verifyOtp = async () => {
		try {
			const res = await api.post<IResponse>("/api/users/verify-otp/", {
				phone,
				otp: parseInt(otp),
			});

			if (res.status === 200) {
				console.log("");
				addMessage("success", "Success", res?.data?.message);
				setTimeout(() => {
					navigate("/");
				}, 3000);
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			console.error(err);
			addMessage("error", "Error", err?.response?.data?.message);
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
						{process === "login" && (
							<>
								<label>
									Enter your phone number below to continue
								</label>
								<input
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
								/>
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
										background:
											'url("src/assets/common/otp.png")',
										backgroundSize: "cover",
									}}
									// containerStyle={{ margin: "5px" }}
									isInputNum
								/>
							</>
						)}
					</div>
					<div className='btn-container'>
						<Button
							title={process === "login" ? "CONTINUE" : "VERIFY"}
							onClickCapture={async (e) => {
								e.preventDefault();
								if (process === "login") {
									await sendOtp();
								} else if (process === "otp") {
									verifyOtp();
									// setProcess("register");
								}
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
	// 		<Grid container xs={12} alignItems='center' justifyContent='center'>
	// 			<Grid
	// 				xs={8}
	// 				height='72vh'
	// 				display='flex'
	// 				alignItems='center'
	// 				flexDirection='column'
	// 				className='login-container'
	// 			>
	// 				<Grid
	// 					display='flex'
	// 					alignItems='center'
	// 					justifyContent='center'
	// 					mt={14}
	// 				>
	// 					<img alt='logo' src={logo} className='logo' />
	// 				</Grid>
	// 				{process === "login" && (
	// 					<Grid
	// 						display='flex'
	// 						flexDirection='column'
	// 						alignItems='center'
	// 						justifyContent='center'
	// 						mt={2}
	// 						className='input-container'
	// 					>
	// 						<Typography
	// 							sx={{
	// 								typography: {
	// 									md: "h4",
	// 									sm: "h5",
	// 									xs: "h6",
	// 								},
	// 							}}
	// 							component='label'
	// 							textAlign='center'
	// 						>
	// 							Enter your phone number below to continue
	// 						</Typography>
	// 						<Grid
	// 							xs={10}
	// 							md={12}
	// 							display={"flex"}
	// 							width='100%'
	// 							mt={4}
	// 						>
	// 							<Box
	// 								component='input'
	// 								type='number'
	// 								id='phone-number'
	// 								name='phone-number'
	// 								placeholder='Enter your phone number'
	// 								value={phone}
	// 								onChangeCapture={(
	// 									e: ChangeEvent<HTMLInputElement>
	// 								) => {
	// 									const phoneNum = e.target.value;
	// 									if (phoneNum.length <= 10) {
	// 										setPhone(e.target.value);
	// 									}
	// 								}}
	// 							/>
	// 						</Grid>
	// 					</Grid>
	// 				)}
	// 				<Grid
	// 					className='btn-container'
	// 					display='flex'
	// 					flexDirection='column'
	// 					mt={4}
	// 				>
	// 					<Button
	// 						title={process === "login" ? "CONTINUE" : "VERIFY"}
	// 						onClickCapture={async (e) => {
	// 							e.preventDefault();
	// 							if (process === "login") {
	// 								await sendOtp();
	// 							} else {
	// 								verifyOtp();
	// 							}
	// 						}}
	// 					/>
	// 					<button
	// 						className='cancel-btn'
	// 						onClickCapture={(e) => {
	// 							e.preventDefault();
	// 							// alert("alert");
	// 						}}
	// 					>
	// 						<svg
	// 							xmlns='http://www.w3.org/2000/svg'
	// 							fill='none'
	// 							viewBox='0 0 24 24'
	// 							strokeWidth='1.5'
	// 							stroke='currentColor'
	// 							className='w-6 h-6'
	// 						>
	// 							<path
	// 								strokeLinecap='round'
	// 								strokeLinejoin='round'
	// 								d='M6 18L18 6M6 6l12 12'
	// 							/>
	// 						</svg>
	// 					</button>
	// 				</Grid>
	// 			</Grid>
	// 		</Grid>
	// 		<Box
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
	// 		</Box>
	// 	</>
	// );
};
export default Login;
