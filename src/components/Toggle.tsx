import { cn } from '@/lib/utils';

interface ToggleProps {
    className?: string;
    id?: string;
    label?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLLabelElement>) => void;
    checked?: boolean;
}

/**
 * Toggle component that renders a styled checkbox as a toggle switch
 *      based on the excellent HyperUI component (https://www.hyperui.dev/components/application/toggles).
 * @component
 * @param {object} props - Component props
 * @param {string} [props.className=''] - Additional CSS classes for the toggle
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - All standard input checkbox props are supported
 *
 * @example
 * // Basic usage
 * <Toggle onChange={handleToggle} checked={isEnabled} />
 *
 * @example
 * // With custom styling
 * <Toggle className="my-custom-class" defaultChecked />
 *
 * @returns {JSX.Element} A toggle switch component
 */
const Toggle: React.FC<ToggleProps> = ({
    className = '',
    id = 'noId',
    onChange,
    onClick,
    ...props
}: ToggleProps): JSX.Element => {
    return (
        <label
            htmlFor={id}
            onClick={(e) => {
                e.preventDefault();
                if (onClick) {
                    onClick(e);
                }

                const checkbox = document.getElementById(id) as HTMLInputElement;
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    if (onChange) {
                        // Create a synthetic change event
                        const syntheticEvent = {
                            target: checkbox,
                            currentTarget: checkbox,
                            preventDefault: () => {},
                            stopPropagation: () => {},
                            bubbles: true,
                            cancelable: true,
                            timeStamp: new Date().getTime(),
                            type: 'change',
                        } as React.ChangeEvent<HTMLInputElement>;
                        onChange(syntheticEvent);
                    }
                }
            }}
            className={cn(
                'relative block h-4 w-8 rounded-full bg-zinc-700 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-green-600',
                className,
            )}
        >
            <input type="checkbox" id={id} className="peer sr-only" {...props} />
            <span className="absolute inset-y-0 left-0 aspect-square rounded-full bg-zinc-300 shadow-md transition-all peer-checked:left-4 peer-checked:bg-zinc-200"></span>
        </label>
    );
};
export default Toggle;
