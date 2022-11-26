//*All imports go here!
import api, { Routes } from "@api";
import { AppStore, GooglePlay } from "@assets";
import logo from "@assets/common/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { IError, ISuccess } from "@types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../miscellaneous/index.scss";

const Footer = () => {
	const [html, setHtml] = useState<string>("");

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
						<h2>ABOUT US</h2>
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
						<div className='flex-row'>
							<div className='line'></div>
							<div style={{ marginLeft: "10px" }}>
								Download App
							</div>
							<GooglePlay height={40} />
							<AppStore height={40} />
						</div>
						<div className='social-icons'>
							<FacebookIcon fontSize='large' />
							<TwitterIcon fontSize='large' />
							<YouTubeIcon fontSize='large' />
							<InstagramIcon fontSize='large' />
						</div>
					</div>
					<div className='footer-links'>
						<Link to='/privacy-policy'>Privacy Policy</Link>
						<a className='reserved-rights'>
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
