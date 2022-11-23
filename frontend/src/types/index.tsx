import { AlertColor } from "@mui/material";
import Actions from "@redux/actions";

export type ISuccess<T = string> = {
	message: string;
	result: T;
	// phone: string[];
};

export type IMessage = {
	severity: AlertColor;
	title: string;
	description?: string;
};

export type IError = {
	full_name: string[];
	email: string[];
	phone: string[];
	age: string[];
};

export type IResponse = ISuccess & IError;

export type IAPI = {
	[s: string]: {
		name: string;
		api: string;
	};
};

export type IMovieItem = {
	title: string;
	image: string;
};

export type IMovieList = {
	title: string;
	items: IMovieItem[];
};

export type IMovieItemProps = {
	item: ICategoryItem;
};

export type IRoutes = {
	title: string;
	path: string;
};

export type ICustomSelectOption<T = string> = {
	value: T;
	label: string;
	disabled?: boolean;
};

export type IReducer<T = any> = {
	type: Actions;
	payload: T;
};

export type ICategories = {
	categories: ICategory[];
};

export type ICategory = {
	name: string;
	category_items: ICategoryItem[];
};

export type ICategoryItem = {
	id: number;
	genres: IGenre[];
	age_rating: string;
	language: string;
	created: Date;
	modified: Date;
	name: string;
	description: string;
	poster_small_vertical_image: string;
	poster_large_vertical_image: string;
	poster_small_horizontal_image: string;
	poster_large_horizontal_image: string;
	duration?: string;
	release_date_time: Date;
	coming_soon_flag: boolean;
	show_trailer_flag: boolean;
	director_name?: string;
	star_cast?: string;
	trailer_link?: string;
	published: boolean;
	rankings: number;
};

export type IGenre = {
	id: number;
	created: Date;
	modified: Date;
	name: string;
};
