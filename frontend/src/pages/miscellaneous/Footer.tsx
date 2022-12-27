//*All imports go here!
import api, { Routes } from "@api";
import { AppStore, GooglePlay } from "@assets";
import logo from "@assets/common/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Grid, Stack } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import { IError, ISuccess } from "@types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../miscellaneous/index.scss";

const Footer = () => {
	const [html, setHtml] = useState<string>("");
	const prefs = useAppSelector((state) => state.preferences);

	const [
		app_name,
		playstore,
		appstore,
		facebook,
		twitter,
		youtube,
		instagram,
	] = [
		prefs?.name_of_the_app?.value,
		prefs?.play_store_link?.value,
		prefs?.apple_store_link?.value,
		prefs?.facebook?.value,
		prefs?.twitter?.value,
		prefs?.youtube?.value,
		prefs?.instagram?.value,
	];

	return (
		<>
			<div className='footer-main-container'>
				<Grid
					container
					py={3}
					sx={{
						backgroundColor: "var(--website-primary-color)",
						borderTopLeftRadius: "20px",
						borderTopRightRadius: "20px",
					}}
				>
					<Grid item xs={12} md={6}>
						<div className='about-us-container'>
							<div className='logo-container flex-row'>
								<Box
									sx={{
										height: 70,
										width: 70,
										mt: 2,
									}}
									className='d-center'
								>
									{/* <LogoText height={30} /> */}
									<img
										alt='logo'
										src={prefs?.logo_url?.image}
										style={{
											objectFit: "contain",
										}}
										width='100%'
										height='100%'
									/>
								</Box>
							</div>
							{/* <div>
						<h2
							style={{
								color: "var(--website-secondary-color)",
							}}
						>
							ABOUT US
						</h2>
					</div>
					<div
						className='d-center about-us'
						dangerouslySetInnerHTML={{ __html: html }}
					>
					</div> */}
							<div>
								{(playstore !== "" || appstore !== "") && (
									<div className='flex-row'>
										{/* <div className='line'></div>
								<div
									style={{
										marginLeft: "10px",
										color: "var(--website-secondary-color)",
									}}
								>
									Download App
								</div> */}
										<a href={playstore} target='_blank'>
											<GooglePlay height={40} />
										</a>
										{/* <a href={appstore} target='_blank'>
											<AppStore height={40} />
										</a> */}
									</div>
								)}
								<div
									className='social-icons'
									style={{
										flexDirection: "column",
									}}
								>
									<div>
										{facebook && (
											<a href={facebook} target='_blank'>
												<FacebookIcon fontSize='large' />
											</a>
										)}
										{twitter && (
											<a href={twitter} target='_blank'>
												<TwitterIcon fontSize='large' />
											</a>
										)}
										{youtube && (
											<a href={youtube} target='_blank'>
												<YouTubeIcon fontSize='large' />
											</a>
										)}
										{instagram && (
											<a href={instagram} target='_blank'>
												<InstagramIcon fontSize='large' />
											</a>
										)}
									</div>
								</div>
								<div>
									<a
										href={`tel:${prefs?.phone?.value}`}
										style={{
											color: "white",
											display: "block",
											textAlign: "center",
										}}
									>
										Call On: {prefs?.phone?.value}
									</a>
									<a
										href={`mailto:${prefs?.email?.value}`}
										style={{
											color: "white",
											display: "block",
											textAlign: "center",
										}}
									>
										Email: {prefs?.email?.value}
									</a>
								</div>
							</div>
						</div>
					</Grid>
					<Grid item xs={12} md={6} className='links'>
						<Stack textAlign='center' spacing={1}>
							<Link to='/'>Home</Link>
							<Link to='/upcoming'>Upcoming</Link>
							<Link to='/plans'>Plans</Link>
							<Link to='/contact-us'>Contact Us</Link>
							<Link to='/terms-and-conditions'>
								Terms & Conditions
							</Link>
							<Link to='/about-us'>About Us</Link>
							<Link to='/privacy-policy'>Privacy Policy</Link>
							<Link to='/refund-policy'>Refund Policy</Link>
						</Stack>
					</Grid>
				</Grid>
				<div className='footer-links'>
					<a className='reserved-rights' data-app-name={app_name}>
						© 2022 All Rights Reserved to{" "}
					</a>
				</div>
			</div>
		</>
	);
};

export default Footer;
