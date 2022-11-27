import { Banner, DownloadApp, SubscribeButton } from "@components";
import MovieList from "@components/movies";
import { useEffect, useState } from "react";
import { ICategories, ICategory, IError, IResponse, ISuccess } from "@types";
import { AxiosError } from "axios";
import { useAlert } from "@hooks";
import api, { Routes } from "@api";

const Home = () => {
	//Hooks
	const showAlert = useAlert();

	const [movies, setMovies] = useState<ICategory[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get<ISuccess<ICategories>>(
					Routes.HOME_PAGE_LISTINGS
				);

				if (res.status === 200) {
					setMovies(res.data?.result?.categories);
					console.log("Movies", res.data?.result);
				}
			} catch (error) {
				const err = error as AxiosError<ISuccess>;
				console.error(err?.response);
				showAlert("error", "Error", err?.response?.data?.message);
			}
		})();
	}, []);

	return (
		<div
			style={{
				display: "flex",
				flex: 1,
				flexDirection: "column",
			}}
		>
			<Banner />
			{movies?.slice(0, 2)?.map((m) => (
				<MovieList key={m?.name} {...m} />
			))}
			<SubscribeButton />
			{movies?.slice(2)?.map((m) => (
				<MovieList key={m?.name} {...m} />
			))}
		</div>
	);
};

export default Home;
