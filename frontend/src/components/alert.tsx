import { Alert, AlertTitle } from "@mui/material";
import Actions from "@redux/actions";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useEffect } from "react";

const CustomAlert = () => {
	const dispatch = useAppDispatch();
	const alert = useAppSelector((state) => state.alert);

	useEffect(() => {
		// if (alert?.title !== "") {
		// 	const id = setTimeout(() => {
		// 		dispatch({
		// 			type: Actions.HIDE_ALERT,
		// 		});
		// 	}, 4000);

		// 	return () => clearTimeout(id);
		// }
		console.log("Alert Component", alert);
	}, [alert]);

	return (
		<div
			className={`alert-container ${
				alert?.title !== "" ? "show" : "hide"
			}`}
		>
			{alert?.title !== "" && (
				<Alert severity={alert?.severity}>
					<AlertTitle>{alert?.title}</AlertTitle>
					{alert?.description}
				</Alert>
			)}
		</div>
	);
};

export default CustomAlert;
