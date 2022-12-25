//*All imports go here!
import api, { Routes } from "@api";
import { AxiosError } from "axios";
import { Button, CustomInput } from "@components";
import { useAlert } from "@hooks";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import { IError, IResponse, IUser } from "@types";
import jwt_decode from "jwt-decode";
import { ChangeEvent, MouseEvent, useState, useLayoutEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import makeAnimated from "react-select/animated";
import "../login/Login.scss";

const animatedComponents = makeAnimated();

type IToken = Pick<IUser, "email" | "full_name"> & { exp: number };

const Register = () => {
	const navigate = useNavigate();
	const showAlert = useAlert();
	const prefs = useAppSelector((state) => state.preferences);

	//Forgot Password
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const [token, setToken] = useState<IToken>();
	const [tokenJWT, setTokenJWT] = useState<string>("");
	const [isTokenValid, setTokenValid] = useState<boolean>(false);
	const [isValidating, setValidating] = useState<boolean>(true);

	const initialErrorState: IError = {
		password: [],
		confirmPassword: [],
	};

	const [errors, setErrors] = useState<IError>(initialErrorState);

	const [searchParams] = useSearchParams();

	const getValidToken = () => {
		try {
			const _tokenJwt = searchParams?.get("token") ?? "";
			const _token = jwt_decode<IToken>(_tokenJwt);
			console.log("Decoded Token", _token);
			setTokenJWT(_tokenJwt);
			setToken(_token);
			setTokenValid(true);
			setValidating(false);
		} catch (err) {
			console.error("Token Invalid", err);
			setValidating(false);
		}
	};

	useLayoutEffect(() => {
		getValidToken();
	}, []);

	const errorHandler = () => {
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
		return password && confirmPassword && password === confirmPassword;
	};

	const resetPassword = async () => {
		try {
			setErrors(initialErrorState);

			if (!errorHandler()) {
				return;
			}
			const res = await api.post<IResponse>(
				Routes.FORGOT_PASSWORD_VERIFY,
				{
					token: tokenJWT,
					password,
				}
			);

			if (res.status === 200) {
				console.log("Password Reset Successfully");
				showAlert("success", "Success", res?.data?.message);
				setTimeout(() => {
					navigate("/login");
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
					{!isValidating ? (
						isTokenValid ? (
							<>
								<Grid item xs={12} className='d-center'>
									<label
										style={{
											textAlign: "center",
										}}
									>
										Forgot your password
									</label>
								</Grid>
								<Grid
									item
									xs={12}
									className='d-center flex-column'
								>
									<CustomInput
										type='password'
										id='password'
										name='password'
										placeholder='Enter New Password'
										value={password}
										onChangeCapture={(
											e: ChangeEvent<HTMLInputElement>
										) => {
											setPassword(e.target.value);
										}}
										errors={errors?.password}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									className='d-center flex-column'
								>
									<CustomInput
										type='password'
										id='confirm-password'
										name='confirm-password'
										placeholder='Confirm New Password'
										value={confirmPassword}
										onChangeCapture={(
											e: ChangeEvent<HTMLInputElement>
										) => {
											setConfirmPassword(e.target.value);
										}}
										errors={errors?.confirmPassword}
									/>
								</Grid>
								<Grid item xs={12} mt={2} className='d-center'>
									<Button
										title={"RESET"}
										onClickCapture={async (
											e: MouseEvent<HTMLButtonElement>
										) => {
											e.preventDefault();
											resetPassword();
										}}
									/>
								</Grid>

								{/* <Grid item xs={12} className='d-center'>
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
								</Grid> */}
								<Grid item xs={12} className='d-center'>
									<Button
										title={"Cancel"}
										onClickCapture={async (e) => {
											e.preventDefault();
											navigate("/");
										}}
										style={{ margin: "1rem 0" }}
									/>
								</Grid>
							</>
						) : (
							<>
								<Typography mt={2} textAlign='center'>
									The token is invalid
								</Typography>
							</>
						)
					) : (
						<Typography>Validating</Typography>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};
export default Register;
