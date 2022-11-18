import { Grid, IconButton, Tooltip } from "@mui/material";
import { Container } from "@mui/system";
import logo from "@assets/common/logo.png";
import { AndroidLogo, AppleLogo, LogoText } from "@assets";
import { Link, useLocation } from "react-router-dom";
import { SearchOutlined, Close } from "@mui/icons-material";
import { ICustomSelectOption, IRoutes } from "@types";
import "./app-bar.scss";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import AsyncCreatable from "react-select/async-creatable";
import makeAnimated from "react-select/animated";
import { CustomSelectUtils } from "@utils";

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

const animatedComponents = makeAnimated();

const AppBar = () => {
	const location = useLocation();
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [search, setSearch] = useState<string>("");
	const data = ["Aquaman", "Avengers"];

	const loadSuggestions = async (searchKey: string) => {
		return CustomSelectUtils.convertToSelectOption(
			data?.filter((v) => v?.toLowerCase()?.includes(searchKey ?? ""))
		);
	};

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
				<Grid item xs={12} md={10} display='flex'>
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
								<Grid
									item
									className={`search-select ${
										isSearching ? "searching" : ""
									}`}
								>
									<Grid container>
										<Grid item>
											<AsyncCreatable<
												ICustomSelectOption,
												false
											>
												name='search'
												className='w-200'
												closeMenuOnSelect
												components={{
													DropdownIndicator: null,
												}}
												isSearchable
												value={
													(search ?? "") !== ""
														? CustomSelectUtils.getDefaultValue(
																search
														  )
														: undefined
												}
												onChange={(e) => {
													setSearch(e?.value ?? "");
												}}
												loadOptions={loadSuggestions}
												defaultOptions
												styles={CustomSelectUtils.customStyles()}
												placeholder='Search...'
												onKeyDown={(e) => {
													if (!search) return;

													if (e.key === "Enter") {
														//Search movie
														console.log(
															"Searching"
														);
													}
												}}
												menuIsOpen={false}
											/>
										</Grid>
										<Grid item>
											<Tooltip title='Close Search'>
												<IconButton
													className='custom-btn'
													onClickCapture={(e) => {
														setIsSearching(false);
													}}
													style={{
														color: "white",
													}}
												>
													<Close />
												</IconButton>
											</Tooltip>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									item
									className={`search-icon ${
										isSearching ? "searching" : ""
									}`}
								>
									<a
										href='#'
										onClickCapture={(e) => {
											e.preventDefault();
											setIsSearching(true);
										}}
									>
										<SearchOutlined />
									</a>
								</Grid>
							</Grid>
						</Grid>
						{!isSearching && (
							<>
								<Grid item mr={2}>
									<Link to='/login' className='login-btn'>
										Login
									</Link>
								</Grid>
								<Grid item>
									<Link to='/register' className='login-btn'>
										Register
									</Link>
								</Grid>
							</>
						)}
					</Grid>
				</Grid>
			</Grid>
		</>
	);
};

export default AppBar;
