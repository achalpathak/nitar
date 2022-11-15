import { AlertColor } from "@mui/material";

export type ISuccess = {
	message: string;
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
