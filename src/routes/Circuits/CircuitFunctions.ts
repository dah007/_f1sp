import { CIRCUIT_DETAILS, CONTINENTS } from 'constants/circuitConstants';
import type { CircuitProps } from 'types/circuits';
import { isBoundingBoxOutside, isPointInsideBoundingBox } from 'utils/maps';
import mapboxgl, { EasingOptions, LngLat, LngLatBounds, LngLatLike, Map } from 'mapbox-gl';

export const SHOW_PIN_ZOOM = 13;
export const ORIGINAL_LABEL = '-- Select a circuit --';

type CircuitLabelProps = {
    circuitsData: CircuitProps[] | undefined;
    id: string;
    mapContainer: Map | null;
    newBBox: number[];
    originalLabel: string;
    setDropdownLabel: (label: string) => void;
};

interface FlyToPOIProps {
    circuitsData: CircuitProps[] | undefined;
    circuit: CircuitProps;
    map: Map | null;
    setDropdownLabel: (label: string) => void;
    setSelectedCircuit: (circuit: CircuitProps | undefined) => void;
}

interface FlyToProps {
    position: LngLatLike;
    continent: string;
    map: Map | null;
    setSelectedCircuit: (circuit: CircuitProps | undefined) => void;
}

export interface GotoCircuitProps {
    circuitId: string;
    map: Map | null;
    setCircuit: (circuit: CircuitProps) => void;
    setContinent?: (continent: string) => void;
}

export interface GotoContinentProps {
    c: string;
    map: Map | null;
    setC: (circuit: CircuitProps | undefined) => void;
    setCon: (continent: string) => void;
}

interface LoadCircuitLayersProps {
    data: CircuitProps[];
    mapContainer: Map | null;
}

interface ZoomToProps {
    position: LngLatLike;
    continent: string;
    map: Map | null;
    zoomLevel?: number;
}

interface CreateMarkerProps {
    circuit: CircuitProps;
    mapContainer: Map | null;
    mapboxgl: typeof mapboxgl;
}

/**
 * Creates a map marker for a given circuit on a Mapbox map.
 *
 * @param {CreateMarkerProps} props - The properties for creating the marker.
 * @param {Circuit} props.circuit - The circuit data containing longitude, latitude, and full name.
 * @param {mapboxgl.Map} props.mapContainer - The Mapbox map instance where the marker will be added.
 * @param {typeof mapboxgl} props.mapboxgl - The Mapbox GL JS library.
 *
 * @returns {void}
 */
export const createMarker = ({ circuit, mapContainer, mapboxgl }: CreateMarkerProps): void => {
    const el = document.createElement('div');
    el.className = 'mapMarker';

    new mapboxgl.Marker({
        className: 'mapMarker',
    })
        .setLngLat([circuit.longitude, circuit.latitude])
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<p class="m-0 p-0 text-black text-left overflow-ellipsis w-44 text-md">${circuit.full_name}</p>`,
            ),
        )
        .addTo(mapContainer!);
    updateMarkerVisibility(mapContainer?.getZoom() || SHOW_PIN_ZOOM);
};

/**
 * Flies the map view to the specified continent.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.continent - The name of the continent to fly to.
 * @param {Map} params.map - The map instance to manipulate.
 * @param {Function} params.setSelectedCircuit - Function to set the selected circuit to undefined.
 *
 * @throws {Error} If the specified continent does not exist in the CONTINENTS data.
 */
export const flyToContinent = ({continent, map, setSelectedCircuit}
    : FlyToProps
) => {
    setSelectedCircuit(undefined);
    
    console.log('continent',continent);

    if (CONTINENTS[continent]) {
        zoomTo({
            continent,
            zoomLevel: CONTINENTS[continent].zoom,
            position: CONTINENTS[continent].center as LngLatLike,
            map,
        });
    } else {
        console.warn(`Continent ${continent} does not exist in the CONTINENTS data.`);
    }
};

/**
 * Flies the map view to the point of interest (POI) specified by the given circuit.
 * 
 * @param {FlyToPOIProps} props - The properties required to fly to the POI.
 * @param {Circuit} props.circuit - The circuit to fly to.
 * @param {CircuitData[]} props.circuitsData - The data of all circuits.
 * @param {Map} props.map - The map instance to manipulate.
 * @param {Function} props.setDropdownLabel - Function to set the label of the dropdown.
 * @param {Function} props.setSelectedCircuit - Function to set the selected circuit.
 * 
 * @returns {void}
 */
export const flyToPOI = ({
    circuit,
    circuitsData,
    map,
    setDropdownLabel,
    setSelectedCircuit,
}: FlyToPOIProps
): void => {
    // get the bbox for the _current_ map view
    const bbox = CIRCUIT_DETAILS[circuit.id]?.bbox;
    setSelectedCircuit(circuit);

    if (
        map &&
        map.getBounds() &&
        isBoundingBoxOutside(bbox, map.getBounds() as LngLatBounds)
    ) {
        console.warn('------------------ inside - what next');
        // ? maybe we do something here?
    } else {
        console.warn('------------------ outside');
    }

    setDropdownLabel('Flying...');
    // fly to the center view on the bbox
    map
        ?.fitBounds(bbox, {
            padding: { top: 25, bottom: 25, left: 15, right: 15 },
            ...zoomToDefaults,
        })
        .once('moveend', () => {
            if (!map) return;
            if (
                !isPointInsideBoundingBox(
                    new LngLat(map.getCenter().lng, map.getCenter().lat),
                    bbox as LngLatBounds,
                )
            ) {
                console.warn('OUTSIDE');
            }

            updateDropdownLabel({
                mapContainer: map,
                setDropdownLabel,
                circuitsData,
                newBBox: bbox as number[],
                id: circuit.id,
                originalLabel:ORIGINAL_LABEL,
            });

            updateMarkerVisibility(map?.getZoom() || SHOW_PIN_ZOOM);
        });
};

/**
 * Navigates to a specific circuit and updates the map and state accordingly.
 *
 * @param {GotoCircuitProps} params - The parameters for the function.
 * @param {string} params.circuitId - The ID of the circuit to navigate to.
 * @param {any} params.map - The map object to update.
 * @param {Function} params.setCircuit - Function to update the current circuit state.
 * @param {Function} [params.setContinent] - Optional function to update the continent state.
 *
 * @returns {void}
 */
export const gotoCircuit = ({
    circuitId,
    map,
    setCircuit,
    setContinent,
}: GotoCircuitProps) => {
    const circuit = CIRCUIT_DETAILS[circuitId];
    if (setContinent && circuit?.continent) {
        setContinent(circuit.continent);
    }
    
    setCircuit(circuit);
    flyToPOI({
        circuit,
        circuitsData: [], // or pass the actual circuits data
        map,
        setDropdownLabel: () => {},
        setSelectedCircuit: () => {},
    });
};

export const gotoContinent = ({ c, map, setC, setCon }: GotoContinentProps) => {
    setC(undefined);
    setCon(c);
    
    flyToContinent({
        continent: c,
        map,
        setSelectedCircuit: setC,
        position: CONTINENTS[c].center as LngLatLike,
    });
};

export const loadCircuitLayers = ({
    data,
    mapContainer
}: LoadCircuitLayersProps) => {
    if (!data) return;
    if (!mapContainer) return;

    const uniqueArray: CircuitProps[] = data?.filter(
        (obj: CircuitProps, index: number, self: CircuitProps[]) =>
            index === self.findIndex((t: CircuitProps) => t.id === obj.id && t.name === obj.name),
    );
    
    uniqueArray?.map((circuit: CircuitProps) => {
        if (!mapContainer) return;

    createMarker({
        circuit,
        mapContainer,
        mapboxgl,
    });

    fetch(`/src/assets/tracks/${circuit.id}.geojson`)
        .then((response) => response.json())
        .then((data) => {
            if (!data) return;
            if (!mapContainer) return;

            mapContainer.addSource(circuit.id, {
                type: 'geojson',
                data,
            });

            mapContainer.addLayer({
                id: `${circuit.id}-outline`,
                type: 'line',
                source: circuit.id,
                layout: {},
                paint: {
                    'line-color': '#fff',
                    'line-width': 3,
                },
            });
        })
        .catch((error) => {
            console.warn(`Circuit ${circuit.id} has no geojson file.`);
            console.error('Error loading geojson:', error);
        });
    });
};

export const updateDropdownLabel = ({
    mapContainer,
    setDropdownLabel,
    circuitsData,
    newBBox,
    originalLabel,
}: CircuitLabelProps) => {
    if (!mapContainer) return;
    
    for (const circuit of circuitsData || []) {
        const circuitBounds = CIRCUIT_DETAILS[circuit.id]?.bbox;

        if (isBoundingBoxOutside(newBBox as unknown as LngLatBounds, circuitBounds)) {
            setDropdownLabel(`wtf ${originalLabel}`);
            break;
        } else {
            setDropdownLabel(circuit.shortName ?? '');
            break;
        }
    }
};

/**
 * Updates the visibility of map markers based on the provided zoom level.
 *
 * @param zoomLevel - The current zoom level of the map. If the zoom level is greater than or equal to `SHOW_PIN_ZOOM`, 
 *                    the markers will be hidden. Otherwise, they will be visible.
 */
export const updateMarkerVisibility = (zoomLevel: number) => {
        const markers = document.getElementsByClassName('mapMarker');
        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i] as HTMLElement;
            marker.style.visibility = zoomLevel >= SHOW_PIN_ZOOM ? 'hidden' : 'visible';
        }
    };

/**
 * Zooms the map to a specified position and zoom level.
 *
 * @param {Object} params - The parameters for the zoom operation.
 * @param {LngLat} params.position - The geographical position to zoom to.
 * @param {number} [params.zoomLevel=15] - The zoom level to set on the map. Defaults to 15.
 * @param {Map} params.map - The map instance to perform the zoom operation on.
 *
 * @returns {void}
 */
export const zoomTo = ({ position, zoomLevel = 15, map }: ZoomToProps) => {
    updateMarkerVisibility(zoomLevel);
    if (!map) return;

    if (
        map &&
        map.getBounds() &&
        isPointInsideBoundingBox(position as LngLat, (map.getBounds() as LngLatBounds) || [0.0, 1])
    ) {
        console.warn('FLY TO!?!?!? inside');
    }

    map.flyTo({
        ...zoomToDefaults,
        center: position,
        zoom: zoomLevel,
    });
};

/**
 * Default options for zooming functionality.
 * 
 * @property {number} speed - The speed of the zoom, where higher values indicate faster zooming.
 * @property {number} curve - The curve factor for the zoom, affecting the acceleration/deceleration.
 * @property {(t: number) => number} easing - The easing function to control the zoom transition.
 */
export const zoomToDefaults: EasingOptions = {
    speed: 3.5,
    curve: 1,
    easing: (t) => t,
};
