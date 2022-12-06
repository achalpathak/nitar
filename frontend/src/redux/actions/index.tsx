enum Actions {
	SHOW_ALERT = "SHOW_ALERT",
	HIDE_ALERT = "HIDE_ALERT",
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT",
	SAVE_PREFERENCES = "SAVE_PREFERENCES",
	REMOVE_PREFERENCES = "REMOVE_PREFERENCES",
	SET_LOADING = "SET_LOADING",
	REMOVE_LOADING = "REMOVE_LOADING",
}

export type ReducerAction<T> = {
	type: Actions;
	payload: T;
};

export default Actions;
