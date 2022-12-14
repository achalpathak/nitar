import { AlertColor } from "@mui/material";
import Actions from "@redux/actions";

export type ISuccess<T = string> = {
	message: string;
	result: T;
};

export type IMessage = {
	severity: AlertColor;
	title: string;
	description?: string;
};

export type IError = {
	[s: string]: string[];
};

export type IResponse<T = any> = ISuccess<T> & IError;

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
	extra_categories: ICategory[];
};

export type ICategory = {
	name: string;
	poster_type: keyof IImageType;
	data: ICategoryItem[];
};

export type IEpisodes = {
	name: string;
	poster_type: keyof IImageType;
	series: ISeriesItem;
	onChange: (item: IEpisodesSet) => void;
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
	duration?: string;
	release_date_time: Date;
	coming_soon_flag: boolean;
	show_trailer_flag: boolean;
	director_name?: string;
	star_cast?: string;
	trailer_link?: string;
	published: boolean;
	rankings: number;
	content_type: "movie" | "series";
	slug: string;
	media: string;
	membership_required: boolean;
	video_link: string;
	episodes_set: IEpisodesSet[];
} & IImageType;

export type ISeriesItem = {
	id: number;
	genres: IGenre[];
	age_rating: string;
	language: string;
	created: Date;
	modified: Date;
	name: string;
	description: string;
	duration?: string;
	director_name?: string;
	star_cast?: string;
	trailer_link?: string;
	published: boolean;
	slug: string;
	episodes_set: IEpisodesSet[];
} & IImageType;

export type IEpisodesSet = {
	id: number;
	created: Date;
	modified: Date;
	name: string;
	description: string;
	episode_number: number;
	duration: string;
	membership_required: boolean;
	video_link: string;
	slug: string;
	published: boolean;
	series: number;
} & IImageType;

export type IImageType = {
	poster_small_vertical_image: string;
	poster_large_vertical_image: string;
	poster_small_horizontal_image: string;
	poster_large_horizontal_image: string;
};

export type IGenre = {
	id: number;
	created: Date;
	modified: Date;
	name: string;
};

export type IPrefs = {
	field: string;
	value: string;
	toggle_value: boolean;
	image: string;
	field_description: string;
};

export type IPreferences = {
	[x: string]: IPrefs;
};

export type ISearchResult = {
	name: string;
	description: string;
	poster_small_vertical_image: string;
	slug: string;
	content_type: string;
};

export type IPlans = {
	features: string[];
	plans: IPlanItem[];
};

export type IPlanItem = {
	id: number;
	get_membership_features: string[];
	created: Date;
	modified: Date;
	name: string;
	validity_in_days: number;
	price_in_inr: string;
	price_in_dollar: string;
	published: boolean;
};

export type IBanners = {
	welcome_banner: IWelcomeBanner[];
	poster_banner: IPosterBanner[];
};

export type IWelcomeBanner = {
	id: number;
	created: Date;
	modified: Date;
	website_banner: string;
	mobile_banner: string;
	banner_type: string;
	url: string;
	url_type: "INTERNAL" | "EXTERNAL";
	content_type: string;
	published: boolean;
};

export type IPosterBanner = {
	id: number;
	created: Date;
	modified: Date;
	website_banner: string;
	mobile_banner: string;
	banner_type: string;
	url: string;
	url_type: "INTERNAL" | "EXTERNAL";
	content_type: string;
	published: boolean;
};

export type IUser = {
	full_name: string;
	email: string;
	phone: string;
	phone_verified: boolean;
	email_verified: boolean;
	phone_code: string;
	has_active_membership: boolean;
	newsletter_subscribed: boolean;
};

export type ICountryList = {
	name: string;
	code: string;
};

export type IRazorpay = {
	razorpay_order_id: string;
	razorpay_merchant_key?: any;
	razorpay_amount: number;
	currency: string;
	callback_url: string;
};

export type IStripe = {
	sessionId: string;
	stripe_publishable_key: string;
};

export type IPaytm = {
	id: string;
};

export type IPaymentGateways = "razor_pay" | "stripe" | "paytm";

export type IPaymentState = {
	razor_pay: IRazorpay;
	stripe: IStripe;
	paytm: IPaytm;
};

export type IPaymentConfig<T extends IPaymentGateways> = T extends "razor_ray"
	? IRazorpay
	: T extends "stripe"
	? IStripe
	: IPaytm;

export type IPaymentInitiate = {
	type: IPaymentGateways;
	timestamp: Date;
	status: boolean;
};
