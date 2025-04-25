import { Checkbox } from '../ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form';

import { type DriverCheckboxProps } from 'types/drivers';
/**
 * A functional component that renders a checkbox for a driver within a form.
 *
 * @param {DriverCheckboxProps} props - The properties for the DriverCheckbox component.
 * @param {Object} props.driver - The driver object containing driver details.
 * @param {number} props.index - The index of the driver in the list.
 * @param {Object} props.form - The form object containing form control methods.
 * @param {boolean} props.disabled - Indicates whether the checkbox should be disabled.
 *
 * @returns {JSX.Element} The rendered checkbox component for the driver.
 */
const DriverCheckbox = ({
    disabled,
    driver,
    index,
    updateVoteValues,
    voteValues,
}: DriverCheckboxProps): JSX.Element => {
    return (
        <FormField
            name={`drivers[${index}].username`}
            render={() => (
                <FormItem key={`${driver.id}--${index}`} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                        <Checkbox
                            className="border-gray-400"
                            checked={voteValues.driversInCrash[driver.id] || false}
                            disabled={disabled}
                            onCheckedChange={() => {
                                const currentDriverStatus = voteValues.driversInCrash[driver.id] || false;
                                const newDriverStatus = !currentDriverStatus;
                                console.log('driver.id:', driver.id);
                                console.log('newDriverStatus:', newDriverStatus);
                                updateVoteValues({
                                    driversInCrash: { [driver.id]: newDriverStatus, ...voteValues.driversInCrash },
                                });
                            }}
                        />
                    </FormControl>
                    <FormLabel className="font-normal">{driver.name}</FormLabel>
                </FormItem>
            )}
        />
    );
};

export default DriverCheckbox;
