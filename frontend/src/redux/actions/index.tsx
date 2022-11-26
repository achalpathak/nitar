enum Actions {
	SHOW_ALERT = "SHOW_ALERT",
	HIDE_ALERT = "HIDE_ALERT",
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT",
	SAVE_PREFERENCES = "SAVE_PREFERENCES",
	REMOVE_PREFERENCES = "REMOVE_PREFERENCES",
}

export type ReducerAction<T> = {
	type: Actions;
	payload: T;
};

export default Actions;
