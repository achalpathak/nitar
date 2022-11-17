import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import logo from "@assets/common/logo.png";
import { AndroidLogo, AppleLogo, LogoText } from "@assets";
import { Link, useLocation } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { IRoutes } from "@types";

const routes: IRoutes[] = [
	{
		title: "Home",
		path: "/",
	},
	{
		title: "Upcoming",
		path: "/upcoming",
	},
	{
		title: "Subscribe",
		path: "/subscribe",
	},
	{
		title: "Contact Us",
		path: "/contact-us",
	},
];

const AppBar = () => {
	const location = useLocation();
	return (
		<>
			<Grid
				container
				my={2}
				className='app-bar-container'
				display='flex'
				justifyContent='space-between'
				px={3}
			>
				<Grid item xs={12} md={2} display='flex' mb={{ xs: 2, md: 0 }}>
					<LogoText height={30} />
				</Grid>
				<Grid item xs={12} md={8} display='flex'>
					<Grid
						container
						display={{ xs: "none", md: "flex" }}
						className='routes'
					>
						{routes?.map(({ title, path }) => (
							<Grid
								key={title}
								item
								mr={4}
								className={`${
									location.pathname === path ? "active" : ""
								} nav-item`}
							>
								<Link to={path}>{title}</Link>
							</Grid>
						))}

						<Grid item mr={4}>
							<Grid container>
								<Grid item mr={2}>
									<a
										href='https://play.google.com/store/apps/details?id=com.netflix.mediaclient'
										target='_blank'
									>
										<AndroidLogo height={20} />
									</a>
								</Grid>
								<Grid item mr={2}>
									<a
										href='https://apps.apple.com/in/app/netflix/id363590051'
										target='_blank'
									>
										<AppleLogo height={20} color='white' />
									</a>
								</Grid>
								<Grid item>
									<a href='#'>
										<SearchOutlinedIcon />
									</a>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Link to='/login' className='login-btn'>
								Login
							</Link>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

export default AppBar;
