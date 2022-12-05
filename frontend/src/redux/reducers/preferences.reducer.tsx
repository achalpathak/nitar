import { IMessage, IPreferences, IReducer } from "../../types";
import Actions from "../actions";

const initialState: IPreferences = {} as IPreferences;

const preferences = (
	state: IPreferences = initialState,
	{ type, payload }: IReducer<typeof initialState>
) => {
	switch (type) {
		case Actions.SAVE_PREFERENCES:
			return (state = payload);
		case Actions.REMOVE_PREFERENCES:
			return (state = initialState);
		default:
			return state;
	}
};

export default preferences;
