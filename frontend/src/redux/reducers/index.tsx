import { combineReducers } from "redux";
import alert from "@redux/reducers/alert.reducer";
import preferences from "@redux/reducers/preferences.reducer";
import user from "./user.reducer";
import loading from "./loading.reducer";
import payment from "./payment.reducer";

const appReducer = combineReducers({
	alert,
	preferences,
	user,
	loading,
	payment,
});

export default appReducer;
