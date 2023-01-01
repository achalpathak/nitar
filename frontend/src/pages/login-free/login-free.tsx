import api, { Routes } from "@api";
import { useAlert } from "@hooks";
import { IResponse } from "@types";
import { AxiosError } from "axios";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FreeUser = () => {
	const navigate = useNavigate();
	const showAlert = useAlert();

	useLayoutEffect(() => {
		const initiateFreeUser = async () => {
			try {
				const res = await api.get<IResponse>(Routes.LOGIN_FREE);

				if (res.status === 200) {
					showAlert("success", "Success", res.data?.message);
					navigate("/");
				}
			} catch (error) {
				const err = error as AxiosError<IResponse>;
				console.error(err.response);
				Swal.fire({
					title: "Error",
					text:
						err?.response?.data?.message ?? "Something went wrong!",
					icon: "error",
				});
			}
		};

		initiateFreeUser();
	}, []);

	return null;
};

export default FreeUser;
