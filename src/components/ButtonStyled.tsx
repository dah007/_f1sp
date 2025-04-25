import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { BUTTON_CLASSES } from '@/constants/constants';

interface ButtonStyledProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    clickHandler?: () => void;
}

/**
 * `ButtonStyled` is a React forwardRef component that renders a styled button.
 * It accepts children, clickHandler, onClick, and other button properties.
 *
 * @param {React.PropsWithChildren<ButtonStyledProps>} props - The properties passed to the button component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button.
 * @param {() => void} [props.clickHandler] - An optional click handler function to be called when the button is clicked.
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => void} [props.onClick] - An optional onClick event handler to be called when the button is clicked.
 * @param {React.Ref<HTMLButtonElement>} ref - A ref to the button element.
 * @returns {JSX.Element} A styled button component.
 */
const ButtonStyled = forwardRef<HTMLButtonElement, ButtonStyledProps>(
    ({ children, clickHandler, onClick, ...rest }, ref) => {
        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            clickHandler && clickHandler();
            onClick && onClick(e);
        };

        return (
            <Button
                ref={ref}
                onClick={handleClick}
                variant="outline"
                className={cn(BUTTON_CLASSES, rest.className)}
                {...rest}
            >
                {children}
            </Button>
        );
    },
);

ButtonStyled.displayName = 'ButtonStyled';
export default ButtonStyled;
