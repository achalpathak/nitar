import { IReducer } from "../../types";
import Actions from "../actions";

const initialState: boolean = false;

const user = (
	state = initialState,
	{ type }: IReducer<typeof initialState>
) => {
	switch (type) {
		case Actions.SET_LOADING:
			return (state = true);
		case Actions.REMOVE_LOADING:
			return (state = initialState);
		default:
			return state;
	}
};

export default user;
