//*All imports go here!
import "../miscellaneous/index.scss";
import { Button } from "@components";
import { MouseEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import api, { Routes } from "@api";
import { useLocation, useNavigate } from "react-router-dom";
import { IError, IAPI, ISuccess } from "@types";
import { Grid } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { useAppSelector } from "@redux/hooks";

const APIS: IAPI = {
	"privacy-policy": {
		name: "Privacy Policy",
		api: Routes.PRIVACY_POLICY,
	},
	"terms-and-conditions": {
		name: "Terms and Conditions",
		api: Routes.TERMS_AND_CONDITIONS,
	},
	"refund-policy": {
		name: "Refund Policy",
		api: Routes.REFUND_POLICY,
	},
};

const Policy = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const prefs = useAppSelector((state) => state.preferences);

	const [html, setHtml] = useState<string>("");

	const currentPath = APIS[location.pathname?.substring(1)];
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
				setHtml(`<h1>Unable to get ${currentPath?.name}</h1>`);
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
								color: "var(--website-secondary-color)",
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
								navigate("/contact-us");
							}}
						/>
						<Grid container className='privacy-call-button'>
							<Grid
								item
								xs={12}
								sm={12}
								mt={2}
								className='call-button'
							>
								<a href={`tel:${prefs?.phone?.value}`}>
									<Grid container className='call-us'>
										<PhoneIcon />
										Call On: {prefs?.phone?.value ?? ""}
									</Grid>
								</a>
							</Grid>
						</Grid>
					</div>
				</div>
			</div>
		</>
	);
};
export default Policy;
