import { combineReducers } from "redux";
import alert from "@redux/reducers/alert.reducer";
import preferences from "@redux/reducers/preferences.reducer";
import user from "./user.reducer";

const appReducer = combineReducers({
	alert,
	preferences,
	user,
});

export default appReducer;
