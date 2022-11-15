//*All imports go here!
import "../miscellaneous/index.scss";
import logo from "@assets/common/logo.png";
import { Button, CustomInput } from "@components";
import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useState,
} from "react";
import { AxiosError } from "axios";
import api, { Routes } from "@api";
import {
	Alert,
	AlertColor,
	AlertTitle,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { IMessage, IResponse, IError, ISuccess } from "@types";
import data from "../../local-json/data.json";
import { AppStore, GooglePlay } from "@assets";

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
			<div className='main-container'>
				<div className='privacy-container'>
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
						className='about-us'
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
					<div
						className='flex-row'
						style={{ width: "50vw", marginRight: "10px" }}
					>
						<div className='line'></div>
						<div style={{ marginLeft: "10px" }}>Download App</div>
						<GooglePlay height={40} />
						<AppStore height={40} />
					</div>
					<div>Test</div>
				</div>
			</div>
		</>
	);
};

export default Footer;
