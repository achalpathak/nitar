//*All imports go here!
import "../miscellaneous/index.scss";
import logo from "@assets/common/logo.png";
import { Button, CustomInput } from "@components";
import {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	useEffect,
	useMemo,
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IMessage, IResponse, IError, IAPI, ISuccess } from "@types";
import data from "../../local-json/data.json";
import AboutUs from "@pages/miscellaneous/Footer";

const APIS: IAPI = {
	"privacy-policy": {
		name: "Privacy Policy",
		api: Routes.PRIVACY_POLICY,
	},
	"terms-and-conditions": {
		name: "Terms and Conditions",
		api: Routes.TERMS_AND_CONDITIONS,
	},
};

const Policy = () => {
	const location = useLocation();

	const [html, setHtml] = useState<string>("");

	const currentPath = useMemo(
		() => APIS[location.pathname?.substring(1)],
		[location.pathname]
	);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess>(currentPath?.api);

				if (res.status === 200) {
					console.log("Data", res.data);
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
					<div className='flex-row'>
						<div className='line-left'></div>
						<h2
							style={{
								textAlign: "center",
								textTransform: "uppercase",
							}}
						>
							{currentPath?.name}
						</h2>
						<div className='line-right'></div>
					</div>
					<div
						className='dynamic'
						dangerouslySetInnerHTML={{
							__html: html,
						}}
					/>

					{/* <div className='dynamic'>
						<span>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Est et sollicitudin velit laoreet elementum
							mauris. Nibh neque velit.
						</span>
						<span>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Eu tempus, ornare nunc nulla mattis faucibus.
							Pellentesque ac vestibulum odio pellentesque ut sem
							faucibus. Mattis malesuada sit mauris faucibus et
							rhoncus sit malesuada pulvinar. Est non tincidunt
							risus proin sit. Vitae interdum vitae a quam. Duis
							risus a felis vitae scelerisque egestas at. Ultrices
							at quam quis semper. Est consequat integer
							scelerisque morbi. Auctor tempus dui aliquam eu a
							urna. Platea nisi, sem vulputate neque. Eleifend et
							ac ullamcorper nisi. Amet lorem amet in felis arcu
							tempus.
						</span>
						<span>
							Ultricies at est, enim, dui diam faucibus placerat.
							Habitant eu, sodales in vulputate ullamcorper
							elementum. Sed dolor auctor viverra mauris habitasse
							lectus. Gravida sit quam non morbi commodo sed risus
							at non. Molestie massa enim.
						</span>
						<span>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Eu tempus, ornare nunc nulla mattis faucibus.
							Pellentesque ac vestibulum odio pellentesque ut sem
							faucibus. Mattis malesuada sit mauris faucibus et
							rhoncus sit malesuada pulvinar. Est non tincidunt
							risus proin sit. Vitae interdum vitae a quam. Duis
							risus a felis vitae scelerisque egestas at.
						</span>
						<span>
							Ultrices at quam quis semper. Est consequat integer
							scelerisque morbi. Auctor tempus dui aliquam eu a
							urna. Platea nisi, sem vulputate neque. Eleifend et
							ac ullamcorper nisi. Amet lorem amet in felis arcu
							tempus. Ultricies at est, enim, dui diam faucibus
							placerat. Habitant eu, sodales in vulputate
							ullamcorper elementum. Sed dolor auctor viverra
							mauris habitasse lectus. Gravida sit quam non morbi
							commodo sed risus at non. Molestie massa enim.
						</span>
					</div> */}
					<h3>Didn't Get Your Answer?</h3>
					<div className='btn-container'>
						<Button
							title={"Contact Us Now"}
							style={{
								width: "20rem",
								marginBottom: "20px",
								border: "none",
							}}
							onClickCapture={async (
								e: MouseEvent<HTMLButtonElement>
							) => {
								e.preventDefault();
								// register();
							}}
						/>
						<Button
							title={"Call On: 00 1234567890"}
							className='btn'
							onClickCapture={async (
								e: MouseEvent<HTMLButtonElement>
							) => {
								e.preventDefault();
								// register();
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default Policy;
