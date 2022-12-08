//****************************************************************All imports go here!***************************************************************
import api, { Routes } from "@api";
import { Paytm, RazorpayWhite, Stripe } from "@assets";
import Button from "@components/button";
import { CustomLoader } from "@components/loader";
import { AttachMoney, Close, CurrencyRupee } from "@mui/icons-material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Grid, IconButton, Modal, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useAppSelector } from "@redux/hooks";
import { IPaymentConfig, IPlanItem, IPlans, ISuccess } from "@types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useNavigate } from "react-router-dom";
import OldSwal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./plans.scss";

const Swal = withReactContent(OldSwal);

//****************************************************************All imports ends here!***************************************************************

const Plans = () => {
	const prefs = useAppSelector((state) => state.preferences);

	const pay_description = prefs?.pay_description?.value;

	const [plans, setPlans] = useState<IPlans>();
	const [paymentGateways, showPaymentGateways] = useState<boolean>(false);
	const [renderingGateway, showRenderingGateway] = useState<boolean>(false);

	const [currentPlan, setCurrentPlan] = useState<IPlanItem>();

	const navigate = useNavigate();
	const user = useAppSelector((state) => state.user);

	const Razorpay = useRazorpay();

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

	const initiatePayment = async (type: string) => {
		try {
			// showPaymentGateways(false);
			showRenderingGateway(true);
			if (type === "razorpay") {
				const res = await api.post<ISuccess<IPaymentConfig>>(
					Routes.PAYMENT,
					{
						membership_id: currentPlan?.id,
					}
				);

				if (res.status === 200) {
					setTimeout(() => {
						showRenderingGateway(false);
						initiateRazorpay(res.data?.result);
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

	const initiateRazorpay = (data: IPaymentConfig) => {
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

			const res = await api.post<ISuccess<IPaymentConfig>>(
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

	return (
		<>
			<Grid container>
				<Grid container className='plans-container'>
					<Grid item xs={12} sm={12} md={6} mb={2}>
						<Typography
							variant='h2'
							color='var(--website-secondary-color)'
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
											<li key={f}>
												{d?.get_membership_features?.includes(
													f
												) ? (
													<CheckCircleOutlineIcon color='success' />
												) : (
													<CancelOutlinedIcon className='cancel-icon' />
												)}{" "}
												{f}
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
												console.log(
													"Initiating Payment"
												);
												setCurrentPlan(d);
												showPaymentGateways(true);
											}
										}}
									/>
								</Grid>
							</Grid>
						</Grid>
					))}
				</Grid>
				<Grid container className='d-center' my={10}>
					<Grid item xs={12} sm={12} md={10} className='description'>
						<div>
							<Typography variant='h5'>Information</Typography>
						</div>
						<span
							style={{
								color: "var(--website-secondary-color)",
							}}
						>
							{pay_description}
						</span>
						<Grid item className='contact-us-btn'>
							<Button
								title='Contact us'
								onClickCapture={(e) => {
									e.preventDefault();
									navigate("/contact-us");
								}}
							/>
						</Grid>
					</Grid>
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
									e.preventDefault;
									showPaymentGateways(false);
									setCurrentPlan(undefined);
								}}
								className='custom-btn'
								sx={{
									position: "absolute",
									top: 10,
									right: 10,
									// "&:hover": {
									// 	boxShadow:
									// 		"0px 0px 5px 2px var(--website-primary-color)",
									// 	backgroundColor:
									// 		"var(--website-alternate-color)",
									// },
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
										Select a payment gateway to continue
									</Typography>
									<IconButton
										onClickCapture={(e) => {
											e.preventDefault;
											initiatePayment("razorpay");
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
										<Stripe height={40} />
									</IconButton>
								</Stack>
							</Stack>
						</Grid>
					</Grid>
				</Box>
			</Modal>
		</>
	);
};
export default Plans;
