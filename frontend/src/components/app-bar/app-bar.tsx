import "./app-bar.scss";
import { useState } from "react";
import {
	Grid,
	IconButton,
	Tooltip,
	AppBar as MuiAppBar,
	Toolbar,
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Divider,
	SwipeableDrawer,
} from "@mui/material";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { AndroidLogo, AppleLogo, LogoText } from "@assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchOutlined, Close, Menu } from "@mui/icons-material";
import {
	ICategoryItem,
	ICustomSelectOption,
	IRoutes,
	ISearchResult,
	ISuccess,
} from "@types";
import { CustomSelectUtils } from "@utils";
import { useAppSelector } from "@redux/hooks";
import { components } from "react-select";
import axios, { AxiosError } from "axios";
import api, { BASE_URL, Routes } from "@api";

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
		title: "Plans",
		path: "/plans",
	},
	{
		title: "Contact Us",
		path: "/contact-us",
	},
];

const routesMobile = routes?.concat([
	{
		title: "Login",
		path: "/login",
	},
	{
		title: "Register",
		path: "/register",
	},
]);

const animatedComponents = makeAnimated();

const AppBar = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const prefs = useAppSelector((state) => state.preferences);

	const [isSearching, setSearching] = useState<boolean>(false);
	const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

	const data = ["Aquaman", "Avengers"];
	const drawerWidth = 240;

	const loadSuggestions = async (searchKey: string) => {
		try {
			const res = await api.get<ISearchResult[]>(Routes.SEARCH, {
				params: {
					q: searchKey,
				},
			});

			if (res.status === 200) {
				return res.data;
			}
		} catch (error) {
			const err = error as AxiosError<ISuccess>;
			console.log(err.response);
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
			<Link to='/'>
				<Box
					sx={{
						my: 2,
					}}
				>
					<LogoText height={30} />
				</Box>
			</Link>
			<Divider />
			<Box className='d-center'>
				<List>
					{routesMobile.map((item) => (
						<ListItem key={item.title} disablePadding>
							<ListItemButton
								sx={{
									textAlign: "left",
								}}
								onClickCapture={(e) => {
									e.preventDefault;
									navigate(item?.path);
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

	const formatOptionLabel = (v: ISearchResult) => (
		<Box display='flex' key={v?.name}>
			<Box>
				<picture>
					<img
						src={`${
							BASE_URL?.includes("localhost") ? BASE_URL : ""
						}/media/${v?.poster_small_vertical_image}`}
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
				<Box fontFamily='Barlow Condensed'>{v?.description}</Box>
			</Box>
		</Box>
	);

	return (
		<>
			<Box sx={{ display: "flex" }} className='app-bar-container'>
				<MuiAppBar
					component='nav'
					sx={{
						backgroundColor: "black",
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
								sx={{ mr: 2, display: { sm: "none" } }}
							>
								<Menu />
							</IconButton>
							<Box
								sx={{
									mx: 2,
									display: { xs: "none", sm: "flex" },
								}}
							>
								<LogoText width={100} />
							</Box>
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
										href={
											prefs?.find(
												(v) =>
													v.field ===
													"play_store_link"
											)?.value
										}
										target='_blank'
									>
										<AndroidLogo height={20} />
									</a>
								</Box>
								<Box className='d-center'>
									<a
										href={
											prefs?.find(
												(v) =>
													v.field ===
													"apple_store_link"
											)?.value
										}
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
									closeMenuOnSelect
									components={animatedComponents}
									isSearchable
									loadOptions={loadSuggestions}
									defaultOptions
									styles={CustomSelectUtils.customStyles()}
									formatOptionLabel={formatOptionLabel}
									placeholder='Search...'
								/>
								<Tooltip title='Close Search'>
									<IconButton
										className='custom-btn custom-link'
										onClickCapture={(e) => {
											setSearching(false);
										}}
										style={{
											color: "white",
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
										color: "white",
									}}
								>
									<SearchOutlined />
								</IconButton>
							</Box>
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

							{/* <Box
								sx={{
									display: {
										xs: "none",
										sm: "flex",
									},
								}}
							>
								<Link to='/register' className='login-btn'>
									Register
								</Link>
							</Box> */}
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

	// return (
	// 	<>
	// 		<Grid
	// 			container
	// 			my={2}
	// 			className='app-bar-container'
	// 			display='flex'
	// 			justifyContent='space-between'
	// 			px={3}
	// 		>
	// 			<Grid item xs={12} md={2} display='flex' mb={{ xs: 2, md: 0 }}>
	// 				<LogoText height={30} />
	// 			</Grid>
	// 			<Grid item xs={12} md={10} display='flex'>
	// 				<Grid
	// 					container
	// 					display={{ xs: "none", md: "flex" }}
	// 					className='routes'
	// 				>
	// 					{routes?.map(({ title, path }) => (
	// 						<Grid
	// 							key={title}
	// 							item
	// 							mr={4}
	// 							className={`${
	// 								location.pathname === path ? "active" : ""
	// 							} nav-item`}
	// 						>
	// 							<Link to={path}>{title}</Link>
	// 						</Grid>
	// 					))}

	// 					<Grid item mr={4}>
	// 						<Grid container>
	// 							<Grid item mr={2}>
	// 								<a
	// 									href='https://play.google.com/store/apps/details?id=com.netflix.mediaclient'
	// 									target='_blank'
	// 								>
	// 									<AndroidLogo height={20} />
	// 								</a>
	// 							</Grid>
	// 							<Grid item mr={2}>
	// 								<a
	// 									href='https://apps.apple.com/in/app/netflix/id363590051'
	// 									target='_blank'
	// 								>
	// 									<AppleLogo height={20} color='white' />
	// 								</a>
	// 							</Grid>
	// 							<Grid
	// 								item
	// 								className={`search-select ${
	// 									isSearching ? "searching" : ""
	// 								}`}
	// 							>
	// 								<Grid container>
	// 									<Grid item>
	// 										<AsyncCreatable<
	// 											ICustomSelectOption,
	// 											false
	// 										>
	// 											name='search'
	// 											className='w-200'
	// 											closeMenuOnSelect
	// 											components={{
	// 												DropdownIndicator: null,
	// 											}}
	// 											isSearchable
	// 											value={
	// 												(search ?? "") !== ""
	// 													? CustomSelectUtils.getDefaultValue(
	// 															search
	// 													  )
	// 													: undefined
	// 											}
	// 											onChange={(e) => {
	// 												setSearch(e?.value ?? "");
	// 											}}
	// 											loadOptions={loadSuggestions}
	// 											defaultOptions
	// 											styles={CustomSelectUtils.customStyles()}
	// 											placeholder='Search...'
	// 											onKeyDown={(e) => {
	// 												if (!search) return;

	// 												if (e.key === "Enter") {
	// 													//Search movie
	// 													console.log(
	// 														"Searching"
	// 													);
	// 												}
	// 											}}
	// 											menuIsOpen={false}
	// 										/>
	// 									</Grid>
	// 									<Grid item>
	// 										<Tooltip title='Close Search'>
	// 											<IconButton
	// 												className='custom-btn'
	// 												onClickCapture={(e) => {
	// 													setIsSearching(false);
	// 												}}
	// 												style={{
	// 													color: "white",
	// 												}}
	// 											>
	// 												<Close />
	// 											</IconButton>
	// 										</Tooltip>
	// 									</Grid>
	// 								</Grid>
	// 							</Grid>
	// 							<Grid
	// 								item
	// 								className={`search-icon ${
	// 									isSearching ? "searching" : ""
	// 								}`}
	// 							>
	// 								<a
	// 									href='#'
	// 									onClickCapture={(e) => {
	// 										e.preventDefault();
	// 										setIsSearching(true);
	// 									}}
	// 								>
	// 									<SearchOutlined />
	// 								</a>
	// 							</Grid>
	// 						</Grid>
	// 					</Grid>
	// 					<Grid item mr={2}>
	// 						<Link to='/login' className='login-btn'>
	// 							Login
	// 						</Link>
	// 					</Grid>
	// 					<Grid item>
	// 						<Link to='/register' className='login-btn'>
	// 							Register
	// 						</Link>
	// 					</Grid>
	// 				</Grid>
	// 			</Grid>
	// 		</Grid>
	// 	</>
	// );
};

export default AppBar;
