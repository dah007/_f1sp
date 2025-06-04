import { BUTTON_CLASSES, SELECT_CLASSES } from '@/constants/constants';
import type { GotoCircuitProps } from '@/types/circuits';
import type { Map } from 'mapbox-gl';
import type { CircuitDetailsProps, CircuitProps } from 'types/circuits';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CircuitSelectProps {
    circuitsData: CircuitDetailsProps; // CircuitProps[];
    circuit?: CircuitProps;
    map?: Map | null;
    setCircuit?: (circuit: CircuitProps) => void;
    setContinent?: (continent: string) => void;
    gotoCircuit?: (props: GotoCircuitProps) => void;
}

/**
 * Component for selecting a circuit from a dropdown menu.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.circuitsData - Array of circuit data objects.
 * @param {Object} props.circuit - The currently selected circuit object.
 * @param {Object} props.map - The map container object.
 * @param {Function} props.setCircuit - Function to set the selected circuit.
 * @param {Function} props.setContinent - Function to set the continent based on the selected circuit.
 * @param {Function} props.gotoCircuit - Function to navigate to the selected circuit.
 * @returns {JSX.Element} The rendered component.
 */
const CircuitSelect = ({
    circuitsData,
    circuit,
    map,
    setCircuit,
    setContinent,
    gotoCircuit,
}: CircuitSelectProps): JSX.Element => {
    if (!circuitsData || !map) return <></>;
    return (
        <Select
            onValueChange={(circuit) => {
                if (gotoCircuit && setCircuit && map) {
                    gotoCircuit({
                        circuitId: circuit,
                        map: map,
                        setCircuit,
                        setContinent,
                    });
                }
            }}
        >
            <SelectTrigger role="button" className={BUTTON_CLASSES}>
                <SelectValue placeholder={circuit?.full_name || 'Select Circuit'} />
            </SelectTrigger>
            <SelectContent className={SELECT_CLASSES}>
                {Object.keys(circuitsData).map((key) => (
                    <SelectItem key={key} value={key}>
                        {circuitsData[key].full_name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default CircuitSelect;
