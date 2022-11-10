import { FC } from 'react';

type IButton = {
    title: string;

} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const Button: FC<IButton> = ({
    title, ...props
}) => {
    return (
        <button {...props}>
            <span>{title}</span>
        </button>
    );
};

export default Button;