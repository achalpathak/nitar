import { combineReducers } from "redux";
import alert from "@redux/reducers/alert.reducer";

const appReducer = combineReducers({
	alert,
});

export default appReducer;
