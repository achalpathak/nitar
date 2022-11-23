import { IMessage, IReducer } from "../../types";
import Actions from "../actions";

const initialState: IMessage = {
	title: "",
	severity: "info",
	description: "",
};

const alert = (
	state: IMessage = initialState,
	{ type, payload }: IReducer<typeof initialState>
) => {
	switch (type) {
		case Actions.SHOW_ALERT:
			return (state = payload);
		case Actions.HIDE_ALERT:
			return (state = initialState);
		default:
			return state;
	}
};

export default alert;
