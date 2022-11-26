import { combineReducers } from "redux";
import alert from "@redux/reducers/alert.reducer";
import preferences from "@redux/reducers/preferences.reducer";

const appReducer = combineReducers({
	alert,
	preferences,
});

export default appReducer;
