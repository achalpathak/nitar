import { FC, KeyboardEvent } from "react";

type ICustomInputProps = {
	errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>;
const CustomInput: FC<ICustomInputProps> = ({ errors, ...props }) => {
	//? ----Checking if the input is number-----
	const checkIfNumber = (event: KeyboardEvent<HTMLInputElement>) => {
		/**
		 * Allowing: Integers | Backspace | Tab | Delete | Left & Right arrow keys
		 **/

		const regex = new RegExp(
			/(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/
		);

		return !event.key.match(regex) && event.preventDefault();
	};

	return (
		<>
			<input
				className={`${errors && errors?.length > 0 ? "error" : ""} ${
					props.className ? props.className : ""
				}`}
				onKeyDownCapture={(e) => {
					if (props.type === "number") {
						return checkIfNumber(e);
					}
				}}
				{...props}
			/>
			{errors &&
				errors?.length > 0 &&
				errors?.map((v) => (
					<span className='error' key={v}>
						{v}
					</span>
				))}
		</>
	);
};

export default CustomInput;
