//****************************************************************All imports go here!***************************************************************
import Button from "@components/button";
import { Box, Grid, Typography } from "@mui/material";
import "./plans.scss";
import { AttachMoney, CurrencyRupee } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SubscribeButton from "@components/subscribe-button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { IPaymentConfig, IPlans, ISuccess } from "@types";
import api, { Routes } from "@api";
import { useAppSelector } from "@redux/hooks";
import Swal from "sweetalert2";
import useRazorpay, { RazorpayOptions } from "react-razorpay";

//****************************************************************All imports ends here!***************************************************************

const Plans = () => {
	const prefs = useAppSelector((state) => state.preferences);

	const pay_description = prefs?.pay_description?.value;

	const [plans, setPlans] = useState<IPlans>();

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

	const initiatePayment = async (plan_id: number) => {
		try {
			const res = await api.post<ISuccess<IPaymentConfig>>(
				Routes.PAYMENT,
				{
					membership_id: plan_id,
				}
			);

			if (res.status === 200) {
				// setPlans(res.data?.result);
				// Swal.fire({
				// 	title: "Success",
				// 	text: res.data?.message ?? "Payment Successful",
				// 	icon: "success",
				// 	confirmButtonText: "Continue to Home",
				// }).then((res) => {
				// 	if (res.isConfirmed) {
				// 		navigate("/");
				// 	}
				// });
				initiateRazorpay(res.data?.result, plan_id);
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

	const initiateRazorpay = (data: IPaymentConfig, plan_id: number) => {
		try {
			const config: RazorpayOptions = {
				key: data?.razorpay_merchant_key,
				amount: data?.razorpay_amount?.toString(),
				currency: data?.currency,
				name: prefs?.name_of_the_app?.value ?? "",
				description: `${user?.full_name} Purchasing ${
					plans?.plans?.find((v) => v.id === plan_id)?.name ?? ""
				} Plan`,
				image: prefs?.logo_url?.image ?? "",
				order_id: data?.razorpay_order_id,
				handler: (res) => {
					console.log("Payment Successful", res);
					Swal.fire({
						title: "Success",
						text: "Payment Successful",
						icon: "success",
						confirmButtonText: "Continue to Home",
					}).then((res) => {
						navigate("/");
					});
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
					backdrop_color: "rgba(0,0,0,0.5)",
				},
			};

			const rzpay = new Razorpay(config);
			rzpay.on("payment.failed", function (response: any) {
				console.log("Payment Unsuccessful", response);
				Swal.fire({
					title: "Payment Failed",
					text:
						response?.error?.description ?? "Something went wrong!",
					icon: "error",
				});
			});

			rzpay.open();
		} catch (error) {
			console.error(error);
		}
	};

	return (
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
									<span> / {d?.validity_in_days} days</span>
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
											console.log("Initiating Payment");
											initiatePayment(d?.id);
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
	);
};
export default Plans;
