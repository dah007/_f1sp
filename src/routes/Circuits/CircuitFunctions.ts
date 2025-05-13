import { CIRCUIT_DETAILS, CONTINENTS } from 'constants/circuitConstants';
import type { CircuitDetailsProps, CircuitProps } from 'types/circuits';
import { isBoundingBoxOutside, isPointInsideBoundingBox } from 'utils/maps';
import mapboxgl, { EasingOptions, LngLat, LngLatBounds, LngLatLike, Map } from 'mapbox-gl';

export const SHOW_PIN_ZOOM = 16; // Zoom level at which the markers are hidden
export const ORIGINAL_LABEL = '-- Select a circuit --';

type CircuitLabelProps = {
    circuitsData: CircuitProps[] | undefined;
    id: string;
    map: Map | null;
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
    data: CircuitDetailsProps;
    map: Map | null;
}

interface ZoomToProps {
    position: LngLatLike;
    continent: string;
    map: Map | null;
    zoomLevel?: number;
}

interface CreateMarkerProps {
    circuit: CircuitProps;
    map: Map | null;
    mapboxgl: typeof mapboxgl;
}

/**
 * Preloads the marker images to prevent jank when first displaying markers
 */
export const preloadMarkerImages = () => {
    // Images to preload
    const imageUrls = [new URL('/src/assets/checkeredFlag.png', window.location.origin).href];

    // Create hidden Image elements to preload the images
    imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
};

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
    // Create a custom marker element
    const el = document.createElement('div');
    el.className = 'marker mapMarker hidden'; // Start hidden by default

    // Ensure markers aren't visible during map animations
    const isMapAnimating = document.querySelector('.map-animating') !== null;
    if (isMapAnimating) {
        el.classList.add('hidden');
    }

    // Use absolute path to ensure image loads correctly
    const imageUrl = new URL('/src/assets/checkeredFlag.png', window.location.origin).href;

    // Pre-load image but don't show it until needed
    const img = new Image();
    img.onload = () => {
        // Only apply background after image is fully loaded to prevent jank
        el.setAttribute('data-img-loaded', 'true');
        // Don't set the style directly - will be set when the marker becomes visible
        if (!isMapAnimating && map && !map.isMoving() && !map.isZooming()) {
            requestAnimationFrame(() => {
                el.style.backgroundImage = `url('${imageUrl}')`;
                el.style.transition = 'transform 0.2s ease-in-out, opacity 0.25s ease-in-out';
            });
        }
    };
    img.src = imageUrl;

    // Set initial styles directly via class instead of inline styles for better performance
    el.style.width = `25px`;
    el.style.height = `25px`;

    // Initial state: hidden until map is ready and not animating
    el.style.opacity = '0';

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
                `<p class="m-0 p-0 text-black text-left overflow-ellipsis w-44 text-md">${circuit.full_name}</p>`,
            ),
        );

    // Add marker to map
    marker.addTo(map!);

    // Store marker in a data attribute for easy access
    // This allows for better performance when updating markers
    el.dataset.markerId = circuit.id;

    updateMarkerVisibility(map?.getZoom() || SHOW_PIN_ZOOM);
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

    console.log('--------------- continent', continent);

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
    map?.fitBounds(bbox, {
        padding: { top: 25, bottom: 25, left: 15, right: 15 },
        ...zoomToDefaults,
    }).once('moveend', () => {
        if (!map) return;
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

    // const uniqueArray: CircuitProps[] = data?.filter(
    //     (obj: CircuitProps, index: number, self: CircuitProps[]) =>
    //         index === self.findIndex((t: CircuitProps) => t.id === obj.id && t.name === obj.name),
    // );

    const uniqueArray: CircuitProps[] = Object.values(data).filter(
        (obj: CircuitProps, index: number, self: CircuitProps[]) =>
            index === self.findIndex((t: CircuitProps) => t.id === obj.id && t.name === obj.name),
    );

    await Promise.all(
        uniqueArray?.map(async (circuit: CircuitProps) => {
            if (!map) return;
            try {
                console.log('Loading geojson for circuit:', `../../public/assets/tracks/${circuit.id}.geojson`);
                const response = await fetch(`../../public/assets/tracks/${circuit.id}.geojson`);
                const data = await response.json();
                if (!data) return;
                if (!map) return;

                map.addSource(circuit.id, {
                    type: 'geojson',
                    data,
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

    // Use batched marker creation with requestAnimationFrame for better performance
    let index = 0;
    const batchSize = 3; // Process 3 markers per frame for better performance

    const createBatchedMarkers = () => {
        // Check if map is currently animating - if so, delay marker creation
        if (mapContainer?.classList.contains('map-animating')) {
            // Try again in a moment when animation might be done
            setTimeout(() => requestAnimationFrame(createBatchedMarkers), 100);
            return;
        }

        const endIndex = Math.min(index + batchSize, uniqueArray.length);

        // Process a batch of markers
        for (let i = index; i < endIndex; i++) {
            createMarker({
                circuit: uniqueArray[i],
                map,
                mapboxgl,
            });
        }

        index = endIndex;

        // If there are more markers to create, schedule the next batch
        if (index < uniqueArray.length) {
            requestAnimationFrame(createBatchedMarkers);
        } else {
            // All markers created, remove the creation flag
            mapContainer?.classList.remove('map-creating-markers');

            // Make sure markers are properly hidden/shown based on current map state
            if (map) {
                const isAnimating = mapContainer?.classList.contains('map-animating');
                if (isAnimating) {
                    hideAllMarkers(true);
                } else {
                    throttledMarkerVisibility(map.getZoom() || SHOW_PIN_ZOOM);
                }
            }
        }
    };

    // Start the batched creation process
    requestAnimationFrame(createBatchedMarkers);
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
 * Hides all markers immediately (no animation) for better performance during map movements.
 * @param force - If true, forcibly hide all markers regardless of zoom level
 */
export const hideAllMarkers = (force: boolean = false): void => {
    // Get the container element that holds the Mapbox markers
    const containers = document.getElementsByClassName('mapboxgl-marker');

    // Hide the entire marker DOM elements rather than just changing opacity
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i] as HTMLElement;
        if (force) {
            // Use visibility:hidden instead of opacity for more complete hiding
            container.style.visibility = 'hidden';
            // Use display:none to completely remove from rendering pipeline
            container.style.display = 'none';
            // Also set opacity to 0 as extra measure
            container.style.opacity = '0';
            // Disable transitions for immediate effect
            container.style.transition = 'none';
        }
    }

    // Also hide popups
    const popups = document.getElementsByClassName('mapboxgl-popup');
    for (let j = 0; j < popups.length; j++) {
        const popup = popups[j] as HTMLElement;
        popup.style.display = 'none';
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
    requestAnimationFrame(() => {
        const shouldHide = zoomLevel >= SHOW_PIN_ZOOM;

        // Target the container elements directly for better control
        const markerContainers = document.getElementsByClassName('mapboxgl-marker');

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
    });
};

/**
 * Throttled version of updateMarkerVisibility for better performance
 * during rapid zoom changes or map movements
 */
export const throttledMarkerVisibility = (() => {
    let lastCall = 0;
    let pendingCall: number | null = null;
    const throttleTime = 100; // ms between calls

    return (zoomLevel: number) => {
        // Clear any pending update
        if (pendingCall !== null) {
            window.cancelAnimationFrame(pendingCall);
            pendingCall = null;
        }

        const now = Date.now();

        // If map is animating, don't show markers at all
        if (document.querySelector('.map-animating')) {
            hideAllMarkers(true);
            return;
        }

        if (now - lastCall >= throttleTime) {
            // Immediate update if enough time has passed
            lastCall = now;
            updateMarkerVisibility(zoomLevel);
        } else {
            // Schedule update for later
            pendingCall = window.requestAnimationFrame(() => {
                lastCall = Date.now();
                updateMarkerVisibility(zoomLevel);
                pendingCall = null;
            });
        }
    };
})();

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
