import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import storageSession from "redux-persist/lib/storage/session";
import { encryptTransform } from "redux-persist-transform-encrypt";
// import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore } from "@reduxjs/toolkit";

import appReducer from "@redux/reducers";
import Actions from "@redux/actions";
import { IMessage, IPreferences, IReducer } from "@types";

const rootReducer = (state: any, action: IReducer) => {
	if (action.type === Actions.LOGOUT) {
		// for all keys defined in your persistConfig(s)
		storage.removeItem("persist:root");
		// storage.removeItem('persist:otherKey')

		return appReducer(undefined, action);
	}
	return appReducer(state, action);
};

const persistConfig = {
	key: "root",
	storage: storage,
};

//Redux persist with encryption
const persistedReducer = persistReducer(
	{
		// transforms: [
		// 	encryptTransform({
		// 		secretKey: "9ej%7b6%lh67-j02spn)4l8yhrkc-b3f4qenlaakyig@-ndx8d",
		// 		onError: function (error) {
		// 			// Handle the error.
		// 		},
		// 	}),
		// ],
		...persistConfig,
	},
	rootReducer
);

//Adding Redux devtools support
const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV === "development" ? true : false,
});

const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;

export type RootState = {
	alert: IMessage;
	preferences: IPreferences[];
};

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
