import { ChangeEvent, MouseEvent, useState, useEffect } from "react";
import api, { Routes } from "@api";
import { AndroidLogo, AppleLogo } from "@assets";
import { useAlert } from "@hooks";
import {
	AccountCircle,
	Close,
	LockReset,
	Logout,
	Menu as MenuIcon,
	SearchOutlined,
} from "@mui/icons-material";
import {
	AppBar as MuiAppBar,
	Box,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Modal,
	SwipeableDrawer,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import Actions from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
	IError,
	IResponse,
	IRoutes,
	ISearchResult,
	ISuccess,
	IUser,
} from "@types";
import { CustomSelectUtils } from "@utils";
import { AxiosError } from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import makeAnimated from "react-select/animated";
import AsyncSelect from "react-select/async";
import "./app-bar.scss";
import SwalOrignal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CustomInput from "@components/input";
import { Button } from "@components";

const Swal = withReactContent(SwalOrignal);

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

	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [showUpdatePassword, setShowUpdatePassword] =
		useState<boolean>(false);

	const initialErrorState: IError = {
		password: [],
		confirmPassword: [],
	};

	const [errors, setErrors] = useState<IError>(initialErrorState);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const drawerWidth = 240;

	useEffect(() => {
		if (!showUpdatePassword) {
			setPassword("");
			setConfirmPassword("");
		}
	}, [showUpdatePassword]);

	if (payment?.status) {
		routes = routes.filter((v) => v.title !== "Plans");
	}

	const errorHandler = () => {
		if (!password) {
			setErrors((val) => ({
				...val,
				password: ["Password cannot be empty"],
			}));
		}
		if (!confirmPassword) {
			setErrors((val) => ({
				...val,
				confirmPassword: ["Confirm Password cannot be empty"],
			}));
		}
		if (password && confirmPassword) {
			if (password?.length < 4) {
				setErrors((val) => ({
					...val,
					password: [
						"Password length cannot be less than 4 characters",
					],
				}));
			} else if (password !== confirmPassword) {
				setErrors((val) => ({
					...val,
					confirmPassword: [
						"Password and Confirm Password do not match",
					],
				}));
			}
		}
		return password && confirmPassword && password === confirmPassword;
	};

	const updatePassword = async () => {
		try {
			setErrors(initialErrorState);

			if (!errorHandler()) {
				return;
			}

			const res = await api.post<IResponse<IUser>>(
				Routes.UPDATE_PASSWORD,
				{
					password,
				}
			);

			if (res.status === 200) {
				showAlert("success", "Success", res?.data?.message);
				setShowUpdatePassword(false);
			}
		} catch (error) {
			const err = error as AxiosError<IResponse>;
			const data = err?.response?.data;
			if (data?.message) {
				showAlert("error", "Error", data?.message);
			} else if (data) {
				setErrors(data);
			}
		}
	};

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
				//Reload the page
				navigate(0);

				//Clear Redux
				dispatch({
					type: Actions.LOGOUT,
				});
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
		<Grid container className='d-center'>
			<Grid item xs={8}>
				<Box
					onClick={handleDrawerToggle}
					sx={{ textAlign: "center" }}
					className='drawer-container'
				>
					<Link to='/' className='d-center'>
						<Box
							sx={{
								my: 2,
								width: "100%",
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
						</Box>
					</Link>
					<Box>
						<List>
							{user?.full_name
								? routesMobileAuth.map((item) => (
										<ListItem
											key={item.title}
											disablePadding
										>
											<ListItemButton
												sx={{
													textAlign: "left",
												}}
												onClickCapture={(e) => {
													e.preventDefault;
													if (
														item?.path === "/logout"
													) {
														logout();
													} else {
														navigate(item?.path);
													}
												}}
											>
												<ListItemText
													primary={item.title}
												/>
											</ListItemButton>
										</ListItem>
								  ))
								: routesMobileUnauth.map((item) => (
										<ListItem
											key={item.title}
											disablePadding
										>
											<ListItemButton
												sx={{
													textAlign: "left",
												}}
												onClickCapture={(e) => {
													e.preventDefault;
													if (
														item?.path === "/logout"
													) {
														logout();
													} else {
														navigate(item?.path);
													}
												}}
											>
												<ListItemText
													primary={item.title}
												/>
											</ListItemButton>
										</ListItem>
								  ))}
						</List>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);

	const formatOptionLabel = (v: ISearchResult) => {
		return (
			<Link to={`/${v?.content_type}/${v?.slug}`} className='search'>
				<Box display='flex' key={v?.name}>
					<Box height='100px' width='500px' mr={1}>
						<picture>
							<img
								src={`${v?.poster_small_vertical_image}`}
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
								<MenuIcon />
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
										width: "100%",
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
									width: "100%",
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
												{/* <a
													href='#'
													className='login-btn'
													onClickCapture={(e) => {
														e.preventDefault();
														logout();
													}}
												>
													Logout
												</a> */}
												<Tooltip title='Account settings'>
													<IconButton
														className='custom-btn'
														onClick={handleClick}
														size='small'
														sx={{ ml: 2 }}
														aria-controls={
															open
																? "account-menu"
																: undefined
														}
														aria-haspopup='true'
														aria-expanded={
															open
																? "true"
																: undefined
														}
													>
														<AccountCircle
															sx={{
																width: 32,
																height: 32,
																color: "white",
															}}
														/>
													</IconButton>
												</Tooltip>
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
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "var(--website-secondary-color)",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem
					onClickCapture={(e) => {
						e.preventDefault();
						setShowUpdatePassword(true);
					}}
				>
					<ListItemIcon>
						<LockReset fontSize='small' />
					</ListItemIcon>
					Update Password
				</MenuItem>
				<MenuItem
					onClickCapture={(e) => {
						e.preventDefault();
						logout();
					}}
				>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
			<Modal
				open={showUpdatePassword}
				closeAfterTransition
				onClose={() => setShowUpdatePassword(false)}
			>
				<Grid
					container
					className='input-container d-center'
					sx={{
						height: "100%",
					}}
				>
					<Grid item xs={12} md={6} xl={4}>
						<Grid
							container
							className='d-center'
							sx={{
								backgroundColor:
									"var(--website-alternate-color)",
							}}
							p={3}
							borderRadius='5px'
						>
							<Grid item xs={12} className='d-center'>
								<Typography
									fontFamily='inter'
									fontSize='1.5rem'
								>
									Update Password
								</Typography>
							</Grid>
							<Grid item xs={12} className='d-center flex-column'>
								<CustomInput
									type='password'
									name='password'
									placeholder='Enter New Password'
									value={password}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => {
										setPassword(e.target.value);
									}}
									errors={errors?.password}
								/>
							</Grid>
							<Grid item xs={12} className='d-center flex-column'>
								<CustomInput
									type='password'
									name='confirm-password'
									placeholder='Confirm New Password'
									value={confirmPassword}
									onChangeCapture={(
										e: ChangeEvent<HTMLInputElement>
									) => {
										setConfirmPassword(e.target.value);
									}}
									errors={errors?.confirmPassword}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								mt={2}
								className='d-center flex-column'
							>
								<Button
									title={"Update Password"}
									style={{
										backgroundColor:
											"var(--website-primary-color)",
										color: "var(--website-secondary-color)",
									}}
									onClickCapture={(
										e: MouseEvent<HTMLButtonElement>
									) => {
										e.preventDefault();
										updatePassword();
									}}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								mt={2}
								className='d-center flex-column'
							>
								<Button
									title={"Cancel"}
									style={{
										backgroundColor:
											"var(--website-alternate-color)",
										color: "var(--website-secondary-color)",
										border: "1px solid var(--website-primary-color)",
									}}
									onClickCapture={(
										e: MouseEvent<HTMLButtonElement>
									) => {
										e.preventDefault();
										setShowUpdatePassword(false);
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Modal>
		</>
	);
};

export default AppBar;
