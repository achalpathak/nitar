import { PropsWithChildren } from "react";
import { useAppSelector } from "@redux/hooks";
import { Navigate } from "react-router-dom";

type UCProps = {
	children: JSX.Element;
};

type UCType = (props: PropsWithChildren<UCProps>) => JSX.Element;

const UnauthenticatedRoute: UCType = ({ children }) => {
	const user = useAppSelector((state) => state.user);

	if (!user?.full_name) {
		return children;
	} else {
		return <Navigate to='/' />;
	}
};

export default UnauthenticatedRoute;
