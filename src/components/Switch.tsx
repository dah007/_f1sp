import { Label } from 'components/ui/label';
import { Switch as SwitchShadcn } from 'components/ui/switch';
import { cn } from '@/lib/utils';

interface SwitchProps {
    className?: string;
    id: string;
    label?: string;
    onClick: () => void;
}

/**
 * A functional component that renders a switch and a label.
 *
 * @param {SwitchProps} props - The properties for the Switch component.
 * @param {string} props.id - The id for the switch and label.
 * @param {function} props.onClick - The click event handler for the switch.
 * @param {string} [props.className] - Additional class names for the switch.
 * @param {string} props.label - The text for the label.
 * @returns {JSX.Element} The rendered switch and label components.
 */
const Switch = ({ id, onClick, className, label }: SwitchProps): JSX.Element => {
    return (
        <>
            <SwitchShadcn className={cn('border-gray-500', className)} id={id} onClick={onClick} />
            <Label htmlFor={id} className="text-lg">
                {label}
            </Label>
        </>
    );
};

export default Switch;
