import { JSX } from 'react';

import { CONTINENTS } from 'constants/circuitConstants';

import { BUTTON_CLASSES, SELECT_CLASSES } from 'constants/constants';
import type { Map } from 'mapbox-gl';
import type { CircuitProps, GotoContinentProps } from 'types/circuits';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
    if (!map) return <></>;
    return (
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
            <SelectContent className={SELECT_CLASSES}>
                {Object.keys(CONTINENTS).map((continent, index) => (
                    <SelectItem key={index} value={continent} className="cursor-pointer">
                        {continent}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default ContinentSelect;
