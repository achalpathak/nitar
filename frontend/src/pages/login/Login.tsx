//*All imports go here!
import "./Login.scss";
import logo from "../../assets/common/logo.png";
import { Button } from "../../components";
import { ChangeEvent, useState } from "react";
import OtpInput from "react-otp-input";
import { AxiosError } from "axios";
import api from "../../api";

type IResponse = {
	message: string;
};

const Login = () => {
	const [process, setProcess] = useState<"login" | "otp" | "register">(
		window.location.pathname === "/login" ? "login" : "register"
	);
	const [otp, setOtp] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	//Register
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [dob, setDob] = useState<string>("");

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
			const res = await api.post("/api/users/register/", {
				phone,
				full_name: name,
				email,
				age: getAge(dob),
				terms_conditions_agreed: true,
			});

			if (res.status === 200) {
				console.log("Registered");
				alert("Registered");
				window.location.href = "/login";
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			console.error(err);
			alert(err.message);
		}
	};

	const sendOtp = async () => {
		try {
			const res = await api.post("/api/users/send-otp/", {
				phone,
			});

			if (res.status === 200) {
				console.log("OTP Sent");
				alert("OTP Sent");
				setProcess("otp");
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			console.error(err);
			alert(err.message);
		}
	};

	const verifyOtp = async () => {
		try {
			const res = await api.post("/api/users/verify-otp/", {
				phone,
				otp: parseInt(otp),
			});

			if (res.status === 200) {
				console.log("Successfully Logged In");
				alert("Successfully Logged In");
				window.location.href = "/login";
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			console.error(err);
			alert(err.message);
		}
	};

	return (
		<div className='main-container'>
			<div className='login-container'>
				<div className='logo-container'>
					<img alt='logo' src={logo} width='100%' height='100%'></img>
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
									width: "3rem",
									background:
										'url("src/assets/common/otp.png")',
									backgroundSize: "cover",
								}}
								isInputNum
							/>
						</>
					)}
					{process === "register" && (
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
					)}
				</div>
				<div className='btn-container'>
					<Button
						title={
							process === "login"
								? "CONTINUE"
								: process === "otp"
								? "VERIFY"
								: "REGISTER"
						}
						onClickCapture={async (e) => {
							e.preventDefault();
							if (process === "login") {
								await sendOtp();
							} else if (process === "otp") {
								verifyOtp();
								// setProcess("register");
							} else {
								register();
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
	);
};
export default Login;
