//*All imports go here!
import api, { Routes } from "@api";
import { AppStore, GooglePlay } from "@assets";
import logo from "@assets/common/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useAppSelector } from "@redux/hooks";
import { IError, ISuccess } from "@types";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
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
	] = useMemo(
		() => [
			prefs?.find((v) => v.field === "name_of_the_app")?.value,
			prefs?.find((v) => v.field === "play_store_link")?.value,
			prefs?.find((v) => v.field === "apple_store_link")?.value,
			prefs?.find((v) => v.field === "facebook")?.value,
			prefs?.find((v) => v.field === "twitter")?.value,
			prefs?.find((v) => v.field === "youtube")?.value,
			prefs?.find((v) => v.field === "instagram")?.value,
		],
		[]
	);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess>(Routes.ABOUT_US);

				if (res.status === 200) {
					setHtml(res.data?.message);
				}
			} catch (error) {
				const err = error as AxiosError<IError>;
				console.log(err.response?.data);
			}
		})();
	}, []);

	return (
		<>
			<div className='footer-main-container'>
				<div className='about-us-container'>
					<div className='logo-container flex-row'>
						<img
							alt='logo'
							src={logo}
							width='100%'
							height='100%'
						></img>
					</div>
					<div>
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
						{/* <span>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Dictum orci gravida arcu nec eu imperdiet in
							ac. Morbi id convallis mauris nisl viverra
							pellentesque. Ultricies gravida cum sed facilisis
							sagittis. Dis arcu ornare quam sit pulvinar facilisi
							pellentesque in lobortis. Vulputate ornare turpis
							diam interdum sagittis in tortor sapien. Mauris duis
							turpis erat nunc in sagittis.
						</span> */}
					</div>
					<div>
						{(playstore !== "" || appstore !== "") && (
							<div className='flex-row'>
								<div className='line'></div>
								<div
									style={{
										marginLeft: "10px",
										color: "var(--website-secondary-color)",
									}}
								>
									Download App
								</div>
								<a href={playstore} target='_blank'>
									<GooglePlay height={40} />
								</a>
								<a href={appstore} target='_blank'>
									<AppStore height={40} />
								</a>
							</div>
						)}
						<div className='social-icons'>
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
					<div className='footer-links'>
						<Link to='/privacy-policy'>Privacy Policy</Link>
						<a className='reserved-rights' data-app-name={app_name}>
							© 2022 All Rights Reserved to{" "}
						</a>
						<Link to='/refund-policy'>Refund Policy</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Footer;
