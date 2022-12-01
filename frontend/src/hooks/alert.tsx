import { AlertColor } from "@mui/material";
import Actions from "@redux/actions";
import { useAppDispatch } from "@redux/hooks";
import { IMessage } from "@types";

type IAlert = (icon: AlertColor, title: string, description?: string) => void;

const UseAlert = () => {
	const dispatch = useAppDispatch();

	const showAlert: IAlert = (
		icon: AlertColor,
		title: string,
		description: string = ""
	) => {
		console.log("Showing Alert", alert);
		dispatch({
			type: Actions.SHOW_ALERT,
			payload: {
				title,
				severity: icon,
				description,
			},
		});

		setTimeout(() => {
			dispatch({
				type: Actions.HIDE_ALERT,
			});
		}, 4000);
	};

	return showAlert;
};

export default UseAlert;