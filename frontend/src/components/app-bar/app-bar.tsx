import api, { Routes } from "@api";
import { AndroidLogo, AppleLogo } from "@assets";
import { useAlert } from "@hooks";
import { Close, Menu, SearchOutlined } from "@mui/icons-material";
import {
	AppBar as MuiAppBar,
	Box,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	SwipeableDrawer,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import Actions from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { IRoutes, ISearchResult, ISuccess } from "@types";
import { CustomSelectUtils } from "@utils";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import "./app-bar.scss";

let routes: IRoutes[] = [
	{
		title: "Home",
		path: "/",
	},
	{
		title: "Upcoming",
		path: "/upcoming",
	},
	{
		title: "Plans",
		path: "/plans",
	},
	{
		title: "Contact Us",
		path: "/contact-us",
	},
];

const routesMobileUnauth = routes?.concat([
	{
		title: "Login",
		path: "/login",
	},
	{
		title: "Register",
		path: "/register",
	},
]);

const routesMobileAuth = routes?.concat([
	{
		title: "Logout",
		path: "/logout",
	},
]);

const animatedComponents = makeAnimated();

const AppBar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const showAlert = useAlert();

	const prefs = useAppSelector((state) => state.preferences);
	const user = useAppSelector((state) => state.user);
	const payment = useAppSelector((state) => state.payment);

	const [isSearching, setSearching] = useState<boolean>(false);
	const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

	const drawerWidth = 240;

	if (payment?.status) {
		routes = routes.filter((v) => v.title !== "Plans");
	}

	const loadSuggestions = async (searchKey: string) => {
		try {
			if (searchKey) {
				const res = await api.get<ISuccess<ISearchResult[]>>(
					Routes.SEARCH,
					{
						params: {
							q: searchKey,
						},
					}
				);

				if (res.status === 200) {
					console.log("SearchData", res.data);
					return res.data.result;
				}
			}
		} catch (error) {
			const err = error as AxiosError<ISuccess>;
			console.log(err.response);
		}
		return [];
	};

	const logout = async () => {
		try {
			const res = await api.get<ISuccess>(Routes.LOGOUT);

			if (res.status === 200) {
				dispatch({
					type: Actions.LOGOUT,
				});
				window.location.reload();
			}
		} catch (error) {
			const err = error as AxiosError<ISuccess>;
			console.log(err.response);
			showAlert("error", "Unable to logout", "Please try again");
		}
		return [];
	};

	const handleDrawerToggle = () => {
		setDrawerOpen((v) => !v);
	};

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: "center" }}
			className='drawer-container'
		>
			<Link to='/' className='d-center'>
				<Box
					sx={{
						my: 2,
						height: 70,
						width: 70,
					}}
				>
					<img
						alt='logo'
						src={prefs?.logo_url?.image}
						height='100%'
						width='100%'
						style={{
							objectFit: "contain",
						}}
					/>
				</Box>
			</Link>
			<Box className='d-center'>
				<List>
					{user?.full_name
						? routesMobileAuth.map((item) => (
								<ListItem key={item.title} disablePadding>
									<ListItemButton
										sx={{
											textAlign: "left",
										}}
										onClickCapture={(e) => {
											e.preventDefault;
											if (item?.path === "/logout") {
												logout();
											} else {
												navigate(item?.path);
											}
										}}
									>
										<ListItemText primary={item.title} />
									</ListItemButton>
								</ListItem>
						  ))
						: routesMobileUnauth.map((item) => (
								<ListItem key={item.title} disablePadding>
									<ListItemButton
										sx={{
											textAlign: "left",
										}}
										onClickCapture={(e) => {
											e.preventDefault;
											if (item?.path === "/logout") {
												logout();
											} else {
												navigate(item?.path);
											}
										}}
									>
										<ListItemText primary={item.title} />
									</ListItemButton>
								</ListItem>
						  ))}
				</List>
			</Box>
		</Box>
	);

	const formatOptionLabel = (v: ISearchResult) => {
		return (
			<Link to={`/${v?.content_type}/${v?.slug}`} className='search'>
				<Box display='flex' key={v?.name}>
					<Box height='100px' width='500px' mr={1}>
						<picture>
							<img
								src={`/media/${v?.poster_small_vertical_image}`}
								style={{
									height: "100%",
									width: "100%",
									objectFit: "cover",
								}}
								alt={v?.name}
							/>
						</picture>
					</Box>
					<Box
						display='flex'
						flexDirection='column'
						alignItems='flex-start'
						justifyContent='space-between'
						p={1}
					>
						<Box fontFamily='Barlow Condensed' fontSize='1.2rem'>
							{v?.name}
						</Box>
						<Box
							fontFamily='Barlow Condensed'
							className='search-movie-desc'
						>
							{v?.description}
						</Box>
					</Box>
				</Box>
			</Link>
		);
	};

	return (
		<>
			<Box sx={{ display: "flex" }} className='app-bar-container' py={2}>
				<MuiAppBar
					component='nav'
					sx={{
						backgroundColor: "var(--website-alternate-color)",
					}}
				>
					<Toolbar
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Box className='d-center'>
							<IconButton
								color='inherit'
								aria-label='open drawer'
								edge='start'
								className='custom-btn'
								onClick={handleDrawerToggle}
								sx={{
									mr: 2,
									display: { sm: "none" },
									color: "var(--website-secondary-color)",
								}}
							>
								<Menu />
							</IconButton>
							<Box
								sx={{
									mx: 2,
									display: { xs: "none", sm: "flex" },
									alignSelf: {
										xs: "center",
										md: "flex-start",
									},
								}}
							>
								<Link
									to='/'
									style={{
										width: 50,
										height: 50,
									}}
								>
									<img
										alt='logo'
										src={prefs?.logo_url?.image}
										height='100%'
										width='100%'
										style={{
											objectFit: "contain",
										}}
									/>
								</Link>
							</Box>
						</Box>
						<Box
							sx={{
								mx: 2,
								display: { xs: "flex", sm: "none" },
								alignSelf: "center",
							}}
							className={`logo-mobile ${
								isSearching ? "hide" : ""
							}`}
						>
							<Link
								to='/'
								style={{
									width: 50,
									height: 50,
								}}
							>
								{/* <LogoText width={60} height={30} /> */}
								<img
									alt='logo'
									src={prefs?.logo_url?.image}
									height='100%'
									width='100%'
								/>
							</Link>
						</Box>
						<Box className='d-center'>
							<Box
								sx={{
									display: {
										xs: "none",
										sm: "flex",
									},
								}}
								className='routes d-center'
							>
								{routes?.map(({ title, path }) => (
									<Box
										key={title}
										mr={4}
										className={`${
											location.pathname === path
												? "active"
												: ""
										} nav-item`}
									>
										<Link to={path}>{title}</Link>
									</Box>
								))}
							</Box>
							<Box
								className='d-center'
								mr={2}
								sx={{
									display: {
										xs: "none",
										sm: "flex",
									},
								}}
							>
								<Box mr={2} className='d-center'>
									<a
										href={prefs?.play_store_link?.value}
										target='_blank'
									>
										<AndroidLogo height={20} />
									</a>
								</Box>
								<Box className='d-center'>
									<a
										href={prefs?.apple_store_link?.value}
										target='_blank'
									>
										<AppleLogo height={20} />
									</a>
								</Box>
							</Box>
							<Box
								className={`d-center search-container ${
									isSearching ? "active" : ""
								}`}
							>
								<AsyncSelect<ISearchResult, false>
									name='search'
									className='w-200'
									closeMenuOnSelect={false}
									components={animatedComponents}
									isSearchable
									loadOptions={loadSuggestions}
									defaultOptions
									styles={CustomSelectUtils.customStyles()}
									formatOptionLabel={formatOptionLabel}
									getOptionLabel={(option) => option.name}
									placeholder='Search...'
									noOptionsMessage={() => (
										<div>No results found</div>
									)}
									isClearable={false}
									controlShouldRenderValue={false}
								/>
								<Tooltip title='Close Search'>
									<IconButton
										className='custom-btn custom-link'
										onClickCapture={(e) => {
											setSearching(false);
										}}
										style={{
											color: "var(--website-secondary-color)",
										}}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</Box>
							<Box
								className={`d-center search-icon ${
									!isSearching ? "active" : ""
								}`}
							>
								<IconButton
									className='custom-btn custom-link'
									onClickCapture={(e) => {
										setSearching(true);
									}}
									style={{
										color: "var(--website-secondary-color)",
									}}
								>
									<SearchOutlined />
								</IconButton>
							</Box>
							{!isSearching ? (
								!user?.full_name ? (
									<Box
										mr={2}
										sx={{
											display: {
												xs: "none",
												sm: "flex",
											},
										}}
									>
										<Link to='/login' className='login-btn'>
											Login
										</Link>
									</Box>
								) : (
									<>
										<Box
											mr={2}
											sx={{
												display: "flex",
											}}
										>
											<Typography>
												Welcome
												<Typography color='var(--website-primary-color)'>
													{user?.full_name?.includes(
														" "
													)
														? user?.full_name?.split(
																" "
														  )[0]
														: user?.full_name}
												</Typography>
											</Typography>
											<Box
												ml={2}
												sx={{
													display: {
														xs: "none",
														sm: "flex",
													},
												}}
											>
												<a
													href='#'
													className='login-btn'
													onClickCapture={(e) => {
														e.preventDefault();
														logout();
													}}
												>
													Logout
												</a>
											</Box>
										</Box>
									</>
								)
							) : null}
						</Box>
					</Toolbar>
				</MuiAppBar>
				<Box
					component='nav'
					sx={{
						backgroundColor: "black",
					}}
				>
					<SwipeableDrawer
						variant='temporary'
						open={isDrawerOpen}
						onOpen={handleDrawerToggle}
						onClose={handleDrawerToggle}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
						sx={{
							display: { xs: "block", sm: "none" },
							"& .MuiDrawer-paper": {
								boxSizing: "border-box",
								width: drawerWidth,
								backgroundColor: "rgba(0,0,0,1)",
							},
						}}
					>
						{drawer}
					</SwipeableDrawer>
				</Box>
			</Box>
		</>
	);
};

export default AppBar;
