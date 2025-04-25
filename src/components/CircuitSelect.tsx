import type { CircuitProps } from 'types/circuits';
import type { GotoCircuitProps } from 'routes/Circuits/CircuitFunctions';
import type { Map } from 'mapbox-gl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BUTTON_CLASSES } from '@/constants/constants';

interface CircuitSelectProps {
    circuitsData: CircuitProps[];
    circuit: CircuitProps;
    map: Map | null;
    setCircuit: (circuit: CircuitProps) => void;
    setContinent: (continent: string) => void;
    gotoCircuit: (props: GotoCircuitProps) => void;
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
const CircuitSelect = ({ circuitsData, circuit, map, setCircuit, setContinent, gotoCircuit }: CircuitSelectProps) => {
    return (
        <div className="w-72">
            <Select
                onValueChange={(circuit) =>
                    gotoCircuit({
                        circuitId: circuit,
                        map: map,
                        setCircuit,
                        setContinent,
                    })
                }
            >
                <SelectTrigger role="button" className={BUTTON_CLASSES}>
                    <SelectValue placeholder={circuit?.full_name || 'Select Circuit'} />
                </SelectTrigger>
                <SelectContent>
                    {circuitsData?.map((circuit, index) => (
                        <SelectItem key={index} value={circuit.id} className="cursor-pointer">
                            {circuit.full_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default CircuitSelect;
