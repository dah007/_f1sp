import { CIRCUIT_DETAILS, CONTINENTS } from 'constants/circuitConstants';
import mapboxgl, { EasingOptions, LngLat, LngLatBounds, LngLatLike } from 'mapbox-gl';
import type {
    CircuitLabelProps,
    CircuitProps,
    CreateMarkerProps,
    FlyToPOIProps,
    FlyToProps,
    GotoCircuitProps,
    GotoContinentProps,
    LoadCircuitLayersProps,
    ZoomToProps,
} from 'types/circuits';
import { isBoundingBoxOutside, isPointInsideBoundingBox } from 'utils/maps';

export const SHOW_PIN_ZOOM = 16; // Zoom level at which the markers are hidden
export const ORIGINAL_LABEL = '-- Select a circuit --';

/**
 * Creates a map marker for a given circuit on a Mapbox map.
 *
 * @param {CreateMarkerProps} props - The properties for creating the marker.
 * @param {Circuit} props.circuit - The circuit data containing longitude, latitude, and full name.
 * @param {mapboxgl.Map} props.map - The Mapbox map instance where the marker will be added.
 * @param {typeof mapboxgl} props.mapboxgl - The Mapbox GL JS library.
 *
 * @returns {void}
 */
export const createMarker = ({ circuit, map, mapboxgl }: CreateMarkerProps): void => {
    // if (!map) return;
    const el = document.createElement('div');

    el.className = 'marker mapMarker';
    el.style.backgroundImage = `url('/assets/flag.svg')`;
    el.style.zIndex = '100';
    el.style.width = `25px`;
    el.style.height = `25px`;

    // Create a single marker with the custom element and popup
    const marker = new mapboxgl.Marker({
        element: el, // Use the custom element
        anchor: 'center', // Center the marker on the coordinates
        offset: [0, 0], // No offset
        pitchAlignment: 'auto', // Keeps marker flat regardless of map pitch
        rotationAlignment: 'auto', // Keeps marker oriented with the map
    })
        .setLngLat([circuit.longitude, circuit.latitude])
        .setPopup(
            new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
                className: 'circuit-popup',
            }).setHTML(
                `<p class="m-2 p-2 text-black text-left overflow-ellipsis w-44 text-md">${circuit.full_name}</p>`,
            ),
        );

    // Add marker to map
    marker.addTo(map!);
    updateMarkerVisibility(map!.getZoom() || SHOW_PIN_ZOOM);
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
export const flyToContinent = ({ continent, map, setSelectedCircuit }: FlyToProps) => {
    setSelectedCircuit(undefined);

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
export const flyToPOI = ({ circuit, circuitsData, map, setDropdownLabel, setSelectedCircuit }: FlyToPOIProps): void => {
    if (!map) return;
    // get the bbox for the _current_ map view
    const bbox = CIRCUIT_DETAILS[circuit.id]?.bbox;
    setSelectedCircuit(circuit);

    if (map && map.getBounds() && isBoundingBoxOutside(bbox, map.getBounds() as LngLatBounds)) {
        console.warn('------------------ inside - what next');
        // ? maybe we do something here?
    } else {
        console.warn('------------------ outside');
    }

    setDropdownLabel('Flying...');
    // fly to the center view on the bbox
    map.fitBounds(bbox, {
        padding: { top: 25, bottom: 25, left: 15, right: 15 },
        ...zoomToDefaults,
    }).once('moveend', () => {
        if (!isPointInsideBoundingBox(new LngLat(map.getCenter().lng, map.getCenter().lat), bbox as LngLatBounds)) {
            console.warn('OUTSIDE');
        }

        updateDropdownLabel({
            map,
            setDropdownLabel,
            circuitsData,
            newBBox: bbox as number[],
            id: circuit.id,
            originalLabel: ORIGINAL_LABEL,
        });

        updateMarkerVisibility(map.getZoom() || SHOW_PIN_ZOOM);
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
export const gotoCircuit = ({ circuitId, map, setCircuit, setContinent }: GotoCircuitProps): void => {
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

export const loadCircuitLayers = async ({ data, map }: LoadCircuitLayersProps) => {
    if (!data || !map) return;

    const uniqueArray: CircuitProps[] = Object.values(data).filter(
        (obj: CircuitProps, index: number, self: CircuitProps[]) =>
            index === self.findIndex((t: CircuitProps) => t.id === obj.id && t.name === obj.name),
    );

    await Promise.all(
        uniqueArray?.map(async (circuit: CircuitProps) => {
            if (!map) return;
            try {
                console.log('Loading geojson for circuit:', `/assets/tracks/${circuit.id}.geojson`);

                if (!map) return;

                map.addSource(circuit.id, {
                    type: 'geojson',
                    data: `/assets/tracks/${circuit.id}.geojson`,
                    generateId: false,
                });

                map.addLayer({
                    id: `${circuit.id}-outline`,
                    type: 'line',
                    source: circuit.id,
                    layout: {},
                    paint: {
                        'line-color': '#fff',
                        'line-width': 3,
                    },
                });
            } catch (error) {
                console.warn(`Circuit ${circuit.id} has no geojson file.`);
                console.error('Error loading geojson:', error);
            }
        }) || [],
    ); // Add a class to track that marker creation is in progress
    const mapContainer = map?.getContainer();
    if (mapContainer) {
        mapContainer.classList.add('map-creating-markers');
    }

    for (let i = 0; i < uniqueArray.length; i++) {
        createMarker({
            circuit: uniqueArray[i],
            map,
            mapboxgl: mapboxgl,
        });
    }
};

export const updateDropdownLabel = ({
    map,
    setDropdownLabel,
    circuitsData,
    newBBox,
    originalLabel,
}: CircuitLabelProps) => {
    if (!map) return;

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
 * Uses CSS class toggling for better performance than inline styles.
 *
 * @param zoomLevel - The current zoom level of the map. If the zoom level is greater than or equal to `SHOW_PIN_ZOOM`,
 *                   the markers will be hidden. Otherwise, they will be visible.
 */
export const updateMarkerVisibility = (zoomLevel: number) => {
    // Use requestAnimationFrame for smoother updates
    // requestAnimationFrame(() => {
    const shouldHide = zoomLevel >= 12.5;

    const markerContainers = document.getElementsByClassName('mapMarker');

    for (let i = 0; i < markerContainers.length; i++) {
        const container = markerContainers[i] as HTMLElement;
        const marker = container.querySelector('.marker') as HTMLElement;

        if (shouldHide) {
            // Hide markers if we're zoomed in too far
            container.style.visibility = 'hidden';
            container.style.display = 'none';
            container.style.opacity = '0';
        } else {
            // Reset styles to show markers when appropriate
            container.style.visibility = 'visible';
            container.style.display = 'block';
            container.style.opacity = '1';
            container.style.transition = 'opacity 0.25s ease-in';

            // If there's a marker element inside, restore its styles too
            if (marker) {
                marker.style.opacity = '1';
                marker.classList.remove('hidden');
            }
        }
    }

    // When hiding, also hide any open popups
    const popups = document.getElementsByClassName('mapboxgl-popup');
    for (let j = 0; j < popups.length; j++) {
        const popup = popups[j] as HTMLElement;
        if (shouldHide) {
            popup.style.display = 'none';
            popup.style.visibility = 'hidden';
        } else {
            // Only restore popup visibility on demand, not automatically
            popup.style.display = 'none';
        }
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
export const zoomTo = ({ position, zoomLevel = 15, map }: ZoomToProps): void => {
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
