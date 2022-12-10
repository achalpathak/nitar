import { IPaymentInitiate, IReducer } from "../../types";
import Actions from "../actions";

const initialState: IPaymentInitiate = {} as IPaymentInitiate;

const payment = (
	state: IPaymentInitiate = initialState,
	{ type, payload }: IReducer<typeof initialState>
) => {
	switch (type) {
		case Actions.SET_PAYMENT:
			return (state = payload);
		case Actions.REMOVE_PAYMENT:
			return (state = initialState);
		default:
			return state;
	}
};

export default payment;
