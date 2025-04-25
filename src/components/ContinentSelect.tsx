import { JSX } from 'react';

import { CONTINENTS } from 'constants/circuitConstants';

import { type GotoContinentProps } from 'routes/Circuits/CircuitFunctions';
import type { CircuitProps } from 'types/circuits';
import type { Map } from 'mapbox-gl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BUTTON_CLASSES } from 'constants/constants';

interface ContinentSelectProps {
    continent: string | undefined;
    map: Map | null;
    setCircuit: (circuit: CircuitProps | undefined) => void;
    setContinent: (continent: string) => void;
    gotoContinent: (props: GotoContinentProps) => void;
}

/**
 * A component that renders a dropdown menu for selecting a continent.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.continent - The currently selected continent.
 * @param {Object} props.map - The map container object.
 * @param {Function} props.setCircuit - Function to set the circuit.
 * @param {Function} props.setContinent - Function to set the continent.
 * @param {Function} props.gotoContinent - Function to navigate to the selected continent.
 * @returns {JSX.Element} The rendered ContinentSelect component.
 */
const ContinentSelect = ({
    continent,
    map,
    setCircuit,
    setContinent,
    gotoContinent,
}: ContinentSelectProps): JSX.Element => {
    return (
        <div className="w-72">
            <Select
                data-testid="continent-select"
                onValueChange={(continent) => {
                    if (continent === undefined) return;
                    console.log(continent);
                    gotoContinent({
                        c: continent,
                        map: map,
                        setC: setCircuit,
                        setCon: setContinent,
                    });
                }}
            >
                <SelectTrigger role="button" className={BUTTON_CLASSES}>
                    <SelectValue placeholder={continent ?? `Continent`} />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(CONTINENTS).map((continent, index) => (
                        <SelectItem key={index} value={continent} className="cursor-pointer">
                            {continent}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ContinentSelect;
