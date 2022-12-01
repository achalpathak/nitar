import { IMessage, IPreferences, IReducer, IUser } from "../../types";
import Actions from "../actions";

const initialState: IUser = {} as IUser;

const user = (
	state: IUser = initialState,
	{ type, payload }: IReducer<typeof initialState>
) => {
	switch (type) {
		case Actions.LOGIN:
			return (state = payload);
		case Actions.LOGOUT:
			return (state = initialState);
		default:
			return state;
	}
};

export default user;
