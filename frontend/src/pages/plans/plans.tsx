//****************************************************************All imports go here!***************************************************************
import api, { Routes } from "@api";
import { Paytm, RazorpayWhite, Stripe as StripeIcon } from "@assets";
import Button from "@components/button";
import { CustomLoader } from "@components/loader";
import { AttachMoney, Close, CurrencyRupee } from "@mui/icons-material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Grid, IconButton, Modal, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
	ICountryList,
	IError,
	IPaymentGateways,
	IPlanItem,
	IPlans,
	IResponse,
	IStripe,
	ISuccess,
	IUser,
} from "@types";
import { AxiosError } from "axios";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import OldSwal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./plans.scss";
import { loadStripe } from "@stripe/stripe-js";
import Actions from "@redux/actions";
import moment from "moment";
import { CustomInput } from "@components";
import { CustomSelectUtils } from "@utils";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import OtpInput from "react-otp-input";
import { useAlert } from "@hooks";

const animatedComponents = makeAnimated();

const Swal = withReactContent(OldSwal);

//****************************************************************All imports ends here!***************************************************************

const Plans = () => {
	const dispatch = useAppDispatch();
	const showAlert = useAlert();

	const prefs = useAppSelector((state) => state.preferences);
	const paymentInitiate = useAppSelector((state) => state.payment);

	const pay_description = prefs?.pay_description?.value;

	const [plans, setPlans] = useState<IPlans>();
	const [paymentGateways, showPaymentGateways] = useState<boolean>(false);
	const [renderingGateway, showRenderingGateway] = useState<boolean>(false);
	const [phoneVerification, showPhoneVerification] = useState<boolean>(false);

	const [currentPlan, setCurrentPlan] = useState<IPlanItem>();

	const [countries, setCountries] = useState<ICountryList[]>([]);
	const [country, setCountry] = useState<ICountryList>({} as ICountryList);
	const [phone, setPhone] = useState<string>("");

	const navigate = useNavigate();
	const user = useAppSelector((state) => state.user);

	const Razorpay = useRazorpay();

	const [searchParams] = useSearchParams();

	const [errors, setErrors] = useState<IError>({
		phone: [],
	});

	const [otp, setOtp] = useState<string>("");
	const [process, setProcess] = useState<"login" | "otp">("login");
	const interval = useRef<NodeJS.Timer>();
	const [timer, setTimer] = useState<number>(60);

	const loading = useAppSelector((state) => state.loading);

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

	useEffect(() => {
		if (searchParams.get("success")) {
			if (
				paymentInitiate?.type === "stripe" &&
				paymentInitiate?.status === null
			) {
				if (searchParams.get("success") === "true") {
					//Got Success True
					Swal.fire({
						title: "Payment Successful",
						text: "Your payment is successful",
						icon: "success",
						confirmButtonText: "Continue to Home",
					}).then((res) => {
						navigate("/");
					});

					//Set payment info to success after showing message
					dispatch({
						type: Actions.SET_PAYMENT,
						payload: {
							...paymentInitiate,
							status: true,
						},
					});
				} else if (searchParams.get("success") === "false") {
					//Got Success False
					Swal.fire({
						title: "Payment Failed",
						text: "Your payment has failed",
						icon: "error",
					});

					//Remove payment info after showing message
					dispatch({
						type: Actions.REMOVE_PAYMENT,
					});
				}
			}
		}
	}, [searchParams]);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<IPlans>>(Routes.PLANS);

				if (res.status === 200) {
					setPlans(res.data?.result);
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err.response);
			}
		})();
	}, []);

	const initiatePayment = async (type: IPaymentGateways) => {
		try {
			showRenderingGateway(true);
			showPaymentGateways(false);
			if (type === "razor_pay" || type === "stripe") {
				const res = await api.post<ISuccess<any>>(Routes.PAYMENT, {
					membership_id: currentPlan?.id,
					gateway: type,
				});

				if (res.status === 200) {
					setTimeout(async () => {
						showRenderingGateway(false);

						dispatch({
							type: Actions.SET_PAYMENT,
							payload: {
								type: type,
								timestamp: moment().toDate()?.toString(),
								status: null,
							},
						});

						if (type === "razor_pay") {
							initiateRazorpay(res.data?.result);
						} else if (type === "stripe") {
							const stripe = await loadStripe(
								res.data?.result?.stripe_publishable_key
							);

							showPaymentGateways(false);

							//Redirect to stripe checkout using sessionId from backend
							if (stripe) {
								//Stripe object loaded successfully
								stripe?.redirectToCheckout({
									sessionId: res.data?.result?.sessionId,
								});
							}
						}
					}, 1500);
				}
			} else {
				Swal.fire({
					title: "Gateway not available",
					text: "Payment gateway not available",
					icon: "warning",
				});
			}
		} catch (error) {
			const err = error as AxiosError<ISuccess>;
			console.error(err.response);
			Swal.fire({
				title: "Error",
				text: err?.response?.data?.message ?? "Payment Unsuccessful",
				icon: "error",
			});
		}
	};

	const initiateRazorpay = (data: any) => {
		try {
			const config: RazorpayOptions = {
				key: data?.razorpay_merchant_key,
				amount: data?.razorpay_amount?.toString(),
				currency: data?.currency,
				name: prefs?.name_of_the_app?.value ?? "",
				description: `${user?.full_name} Purchasing ${
					currentPlan?.name ?? ""
				} Plan`,
				image: prefs?.logo_url?.image ?? "",
				order_id: data?.razorpay_order_id,
				handler: async (res) => {
					handlePaymentConfirmation(res, "success");
				},
				prefill: {
					name: user?.full_name,
					email: user?.email,
					contact: user?.phone,
				},
				// notes: {
				// 	address: "Razorpay Corporate Office",
				// },
				theme: {
					color: prefs?.color_primary?.value ?? "#fff",
					backdrop_color: "rgba(0, 0, 0, 0.5)",
				},
				modal: {
					escape: false,
					animation: true,
					backdropclose: false,
					confirm_close: true,
					ondismiss: (() => {
						console.log("Cancelled");
						handlePaymentConfirmation(
							{
								error: "Payment Cancelled",
							},
							"failure"
						);
					}) as any,
				},
			};

			const rzpay = new Razorpay(config);
			rzpay.on("payment.failed", function (response: any) {
				console.log("Payment Unsuccessful", response);
				handlePaymentConfirmation(response.error, "failure");
			});

			rzpay.open();
		} catch (error) {
			console.error(error);
		}
	};

	const handlePaymentConfirmation = async (
		response: any,
		type: "success" | "failure"
	) => {
		try {
			Swal.fire({
				title: "Waiting for Confirmation",
				text: "Please wait while we confirm your payment",
				iconHtml: <CustomLoader />,
			});

			const res = await api.post<ISuccess>(
				Routes.PAYMENT_CONFIRM,
				response
			);

			if (res.status === 200) {
				showPaymentGateways(false);
				if (type === "success") {
					// Swal.hideLoading();
					setTimeout(() => {
						Swal.fire({
							title: "Success",
							text: "Payment Successful",
							icon: "success",
							confirmButtonText: "Continue to Home",
						}).then((res) => {
							navigate("/");
						});
					}, 1500);
				} else {
					Swal.fire({
						title: "Payment Failed",
						text: response?.description ?? "Something went wrong!",
						icon: "error",
					});
				}
			}
		} catch (error) {
			const err = error as AxiosError<ISuccess>;
			console.error(err.response);
			showPaymentGateways(false);
			Swal.fire({
				title: "Error",
				text: err?.response?.data?.message ?? "Payment Unsuccessful",
				icon: "error",
			});
		}
	};

	const sendOtp = async (phoneNum: string = phone) => {
		try {
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
				dispatch({
					type: Actions.LOGIN,
					payload: res.data?.result,
				});
				showPhoneVerification(false);
				Swal.fire({
					title: "Success",
					text:
						res.data?.message ??
						"Phone Number Updated Successfully",
					icon: "success",
					confirmButtonText: "Continue to Payment",
				}).then(async () => {
					showPaymentGateways(true);
				});
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

	const updatePhone = async () => {
		try {
			const res = await api.post<IResponse>(Routes.UPDATE_PHONE, {
				phone: phone,
				phone_code: country.code,
			});

			if (res.status === 200) {
				sendOtp();
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
			<Grid container>
				<Grid container className='d-center' my={10}>
					<Grid item xs={12} sm={12} md={10} className='description'>
						<div className='info'>
							<Typography
								variant='h5'
								color='var(--website-secondary-color)'
							>
								Information
							</Typography>
						</div>
						<span
							style={{
								color: "var(--website-secondary-color)",
							}}
						>
							{pay_description}
						</span>
						{/* <Grid item className='contact-us-btn'>
							<Button
								title='Contact us'
								onClickCapture={(e) => {
									e.preventDefault();
									navigate("/contact-us");
								}}
							/>
						</Grid> */}
					</Grid>
				</Grid>
				<Grid container className='plans-container'>
					<Grid item xs={12} sm={12} md={6} mb={2}>
						<Typography
							variant='h2'
							color='var(--website-secondary-color)'
							style={{
								textDecoration: "underline",
							}}
						>
							Our Subscription Plans
						</Typography>
					</Grid>
				</Grid>
				<Grid container className='plans-card'>
					{plans?.plans?.map((d, i) => (
						<Grid
							key={d.id}
							item
							xs={8}
							sm={5}
							md={3}
							xl={2}
							className='card'
							sx={{
								margin: {
									sm: "0 15px",
								},
								marginBottom: {
									sm: 5,
								},
							}}
						>
							<Grid container>
								<Grid item className='plans-card-items' mb={1}>
									<Typography variant='h5' mb={1}>
										{d?.name}
									</Typography>
									<Box>
										{d?.price_in_inr ? (
											<>
												<CurrencyRupee />
												{d?.price_in_inr}
											</>
										) : d?.price_in_dollar ? (
											<>
												<AttachMoney />
												{d?.price_in_dollar}
											</>
										) : null}
										<span>
											{" "}
											/ {d?.validity_in_days} days
										</span>
									</Box>
								</Grid>
								<Grid item className='plans-card-list'>
									<ul>
										{plans?.features?.map((f) => (
											<li
												key={f}
												style={{
													paddingLeft: "1rem",
												}}
											>
												{d?.get_membership_features?.includes(
													f
												) ? (
													f
												) : (
													<div
														style={{
															color: "transparent",
														}}
													>
														.
													</div>
												)}
											</li>
										))}
									</ul>
								</Grid>
								<Grid item className='buy-now'>
									<Button
										title='Subscribe'
										onClickCapture={(e) => {
											e.preventDefault();
											if (!user.full_name) {
												Swal.fire({
													title: "Login",
													text: "Please login to continue",
													icon: "warning",
													confirmButtonText: "Login",
													cancelButtonText: "Cancel",
													showCancelButton: true,
												}).then((res) => {
													if (res.isConfirmed) {
														navigate("/login");
													}
												});
											} else {
												if (!user.phone_verified) {
													showPhoneVerification(true);
												} else {
													console.log(
														"Initiating Payment"
													);
													setCurrentPlan(d);
													showPaymentGateways(true);
												}
											}
										}}
									/>
								</Grid>
							</Grid>
						</Grid>
					))}
				</Grid>
			</Grid>
			<Modal
				open={paymentGateways}
				closeAfterTransition
				onClose={() => showPaymentGateways(false)}
			>
				<Box width='100%' height='100%' className='d-center'>
					<Grid container className='d-center'>
						<Grid
							item
							xs={11}
							sm={8}
							md={5}
							xl={4}
							sx={{
								position: "relative",
							}}
						>
							<IconButton
								onClickCapture={(e) => {
									e.preventDefault();
									showPaymentGateways(false);
									setCurrentPlan(undefined);
								}}
								className='custom-btn'
								sx={{
									position: "absolute",
									top: 10,
									right: 10,
								}}
							>
								<Close
									height={30}
									sx={{
										color: "var(--website-secondary-color)",
									}}
								/>
							</IconButton>
							<Stack
								direction='column'
								spacing={3}
								sx={{
									backgroundColor: "rgba(0,0,0,0.8)",
									borderRadius: "0.5rem",
									padding: "1rem",
								}}
								alignItems='center'
							>
								{renderingGateway ? (
									<>
										<Typography
											variant='h6'
											color='var(--website-primary-color)'
											textAlign='center'
										>
											Rendering Payment Gateways for You
										</Typography>
										<Box className='d-center'>
											<CustomLoader />
										</Box>
									</>
								) : null}
								<Stack
									direction='column'
									spacing={1.5}
									width='100%'
									alignItems='center'
								>
									<Typography
										variant='body1'
										color='var(--website-primary-color)'
									>
										Select a payment method to continue
									</Typography>
									{prefs?.razor_pay?.toggle_value ? (
										<IconButton
											onClickCapture={(e) => {
												e.preventDefault;
												initiatePayment("razor_pay");
											}}
											className='custom-btn d-flex w-100'
											sx={{
												borderRadius: 2,
												border: "1px solid var(--website-primary-color)",
												backgroundColor:
													"var(--website-alternate-color)",
												"&:hover": {
													boxShadow:
														"0px 0px 5px 2px var(--website-primary-color)",
													backgroundColor:
														"var(--website-alternate-color)",
												},
											}}
										>
											<RazorpayWhite height={30} />
										</IconButton>
									) : null}
									{prefs?.paytm?.toggle_value ? (
										<IconButton
											onClickCapture={(e) => {
												e.preventDefault;
												initiatePayment("paytm");
											}}
											className='custom-btn d-flex w-100'
											sx={{
												borderRadius: 2,
												border: "1px solid var(--website-primary-color)",
												backgroundColor:
													"var(--website-alternate-color)",
												"&:hover": {
													boxShadow:
														"0px 0px 5px 2px var(--website-primary-color)",
													backgroundColor:
														"var(--website-alternate-color)",
												},
											}}
										>
											<Paytm height={30} />
										</IconButton>
									) : null}
									{prefs?.stripe?.toggle_value ? (
										<IconButton
											onClickCapture={(e) => {
												e.preventDefault;
												initiatePayment("stripe");
											}}
											className='custom-btn d-flex w-100'
											sx={{
												borderRadius: 2,
												border: "1px solid var(--website-primary-color)",
												backgroundColor:
													"var(--website-alternate-color)",
												"&:hover": {
													boxShadow:
														"0px 0px 5px 2px var(--website-primary-color)",
													backgroundColor:
														"var(--website-alternate-color)",
												},
											}}
										>
											<StripeIcon height={40} />
										</IconButton>
									) : null}
								</Stack>
							</Stack>
						</Grid>
					</Grid>
				</Box>
			</Modal>
			<Modal
				open={phoneVerification}
				closeAfterTransition
				onClose={() => showPhoneVerification(false)}
			>
				<Box
					width='100%'
					height='100%'
					className='d-center input-container'
				>
					<Grid container className='d-center'>
						<Grid
							item
							xs={11}
							sm={8}
							md={5}
							xl={4}
							sx={{
								position: "relative",
								backgroundColor: "rgba(0,0,0,1)",
							}}
							paddingTop={2}
							paddingBottom={4}
						>
							<div className='d-center flex-column'>
								{process === "login" ? (
									<>
										<Typography variant='h6'>
											Update your phone number
										</Typography>
										<Box className='d-center flex-column'>
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
												getOptionValue={(option) =>
													option.name
												}
												filterOption={(option, input) =>
													option.label
														?.toLowerCase()
														.includes(
															input?.toLowerCase()
														)
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
													const phoneNum =
														e.target.value;
													if (
														phoneNum.length <= 10 &&
														!isNaN(
															parseInt(phoneNum)
														)
													) {
														setPhone(phoneNum);
													}
												}}
												errors={errors?.phone}
											/>
										</Box>
									</>
								) : (
									<div className='d-center flex-column'>
										<label>
											Enter verification code sent on your
											mobile number
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
									</div>
								)}
								<Button
									title={
										process === "login"
											? "CONTINUE"
											: "VERIFY"
									}
									style={{
										fontFamily: "Barlow Condensed",
										marginTop: "1rem",
									}}
									onClickCapture={async (
										e: MouseEvent<HTMLButtonElement>
									) => {
										e.preventDefault();
										if (process === "login") {
											updatePhone();
										} else {
											verifyOtp();
										}
									}}
								/>
							</div>
						</Grid>
					</Grid>
				</Box>
			</Modal>
		</>
	);
};
export default Plans;
