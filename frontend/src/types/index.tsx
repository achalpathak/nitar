import { AlertColor } from "@mui/material";

export type ISuccess = {
	message: string;
	// phone: string[];
};

export type IMessage = {
	severity: AlertColor;
	title: string;
	description?: string | string[];
};

export type IError = {
	name: string[];
	email: string[];
	phone: string[];
	dob: string[];
};

export type IResponse = ISuccess & IError;
