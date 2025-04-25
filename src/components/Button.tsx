/**
 * A customized button component wrapping the UI button.
 *
 * @component
 * @param {Object} props - The component props
 * @param {NonNullable<VariantProps<typeof buttonVariants>['variant']>} [props.variant] - The visual style variant of the button
 * @param {string} [props.className=''] - Additional CSS classes to apply
 * @param {React.ReactNode} [props.children] - The content to render inside the button
 * @param {boolean} [props.asChild] - When true, the component will render its child directly with the props
 * @returns {JSX.Element} A styled button component
 *
 * @example
 * // Default button
 * <Button>Click me</Button>
 *
 * @example
 * // Button with variant
 * <Button variant="destructive">Delete</Button>
 *
 * @example
 * // Button with custom class
 * <Button className="my-custom-class">Custom styled</Button>
 */
import { Button as BButton, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: NonNullable<VariantProps<typeof buttonVariants>['variant']>;
    className?: string;
    children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
    variant,
    className = '',
    children,
    ...props
}: {
    variant?: NonNullable<VariantProps<typeof buttonVariants>['variant']>;
    className?: string;
    children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & { asChild?: boolean }): JSX.Element => {
    return (
        <BButton
            variant={variant as NonNullable<VariantProps<typeof buttonVariants>['variant']>}
            className={`flex items-center ${className}`}
            {...props}
        >
            {children}
        </BButton>
    );
};

export default Button;
