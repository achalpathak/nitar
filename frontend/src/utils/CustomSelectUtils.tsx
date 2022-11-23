import { ICustomSelectOption } from "@types";
import { StylesConfig } from "react-select";

const customStyles = <
	T extends unknown = ICustomSelectOption
>(): StylesConfig<T> => ({
	menu: (provided) => ({
		...provided,
		backgroundColor: "#2a2b36",
	}),
	option: (provided) => ({
		...provided,
		borderBottom: "rgba(255, 255, 255, 0.5) 1px solid",
		color: "white",
		backgroundColor: "#2a2b36",
		fontSize: "0.8rem",
		":hover": {
			color: "var(--info)",
		},
	}),
	control: () => ({
		// none of react-select's styles are passed to <Control />
		width: "100%",
		display: "flex",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderRadius: 5,
		color: "white",
	}),
	singleValue: (provided, state) => {
		const opacity = state.isDisabled ? 0.5 : 1;
		const transition = "opacity 300ms";
		const color = "white";
		const fontSize = "0.8rem";

		return { ...provided, opacity, transition, color, fontSize };
	},
	multiValue: (styles) => ({
		...styles,
		color: "white",
		backgroundColor: "#2a2b36",
	}),
	multiValueLabel: (styles) => ({
		...styles,
		color: "white",
	}),
	input: (styles) => ({
		...styles,
		color: "white",
	}),
});

const convertToSelectOption = <T extends unknown>(
	data: Array<T>,
	label: string = "",
	selectAll: boolean = false
): ICustomSelectOption[] => {
	let allData: ICustomSelectOption[] = [];
	if (data && data?.length !== 0) {
		if (typeof data[0] === "object") {
			if (label === "") {
				throw new Error("Label is required");
			}
			allData = data.map((v): ICustomSelectOption => {
				return {
					// @ts-ignore
					value: v[label as string] as string,
					// @ts-ignore
					label: v[label as string] as string,
				};
			});
		} else if (typeof data[0] === "string" || typeof data[0] === "number") {
			allData = data.map((v): ICustomSelectOption => {
				return {
					value: v as string,
					label: v as string,
				};
			});
		}

		if (allData.length !== 0 && selectAll) {
			allData.unshift({
				label: "Select All",
				value: "*",
			});
		}
	}

	return allData;
};

const getDefaultValue = (value: string): ICustomSelectOption => ({
	value: value ?? "",
	label: value !== "" ? value : "Please select",
	disabled: (value ?? "") !== "" ? false : true,
});

export { customStyles, convertToSelectOption, getDefaultValue };
