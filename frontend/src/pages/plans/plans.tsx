//****************************************************************All imports go here!***************************************************************
import Button from "@components/button";
import { Box, Grid, Typography } from "@mui/material";
import "./plans.scss";
import { AttachMoney, CurrencyRupee } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SubscribeButton from "@components/subscribe-button";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { IPlans, ISuccess } from "@types";
import api, { Routes } from "@api";
import { useAppSelector } from "@redux/hooks";

//****************************************************************All imports ends here!***************************************************************

const Plans = () => {
	const prefs = useAppSelector((state) => state.preferences);

	const pay_description = useMemo(
		() => prefs?.find((v) => v.field === "pay_description")?.value,
		[]
	);

	const [plans, setPlans] = useState<IPlans>();

	const navigate = useNavigate();

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

	return (
		<Grid container>
			<Grid container className='plans-container'>
				<Grid item xs={12} sm={12} md={6} mb={2}>
					<Typography variant='h2'>Our Subscription Plans</Typography>
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
								<Button title='Subscribe' />
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
