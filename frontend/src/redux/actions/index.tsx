enum Actions {
	SHOW_ALERT = "SHOW_ALERT",
	HIDE_ALERT = "HIDE_ALERT",
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT",
}

export type ReducerAction<T> = {
	type: Actions;
	payload: T;
};

export default Actions;
