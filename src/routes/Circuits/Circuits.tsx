import { useAppDispatch } from 'hooks/reduxHooks';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import PageContainer from 'components/PageContainer';
import { setError } from 'slices/siteWideSlice';
import {
    loadCircuitLayers,
    SHOW_PIN_ZOOM,
    throttledMarkerVisibility,
    hideAllMarkers,
    preloadMarkerImages,
    gotoCircuit,
    gotoContinent,
} from './CircuitFunctions';
import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';

import { CircuitProps } from 'types/circuits';
import CircuitSelect from '@/components/CircuitSelect';
import ContinentSelect from '@/components/ContinentSelect';

const Circuits: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const mapContainer = useRef<HTMLDivElement>(null);

    const [circuit, setCircuit] = useState(CIRCUIT_DETAILS['baku']);
    const [circuitBBox /*, setCircuitBBox*/] = useState<CircuitProps['bbox']>(CIRCUIT_DETAILS['baku']?.bbox);
    const [continent, setContinent] = useState<string | undefined>('Europe');

    const map = useRef<mapboxgl.Map>();

    // Preload marker images as soon as component mounts
    useEffect(() => {
        preloadMarkerImages();
    }, []);

    useEffect(() => {
        try {
            setLng(0);
            setLat(0);
            if (mapContainer.current) {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/dark-v11',
                    center: [-1.02602, 52.09216],
                    zoom,
                    maxZoom: 15,
                    renderWorldCopies: true, // Better handling of markers at map edges
                    fadeDuration: 0, // Reduces lag when moving
                    trackResize: true,
                    attributionControl: false, // We'll add this separately if needed
                    antialias: true, // Smoother rendering
                    maxPitch: 60, // Limit pitch for better performance
                    minZoom: 2, // Limit min zoom for better performance
                    cooperativeGestures: true, // Improved touch handling
                    preserveDrawingBuffer: false, // Better performance
                });

                // Add zoom controls
                // map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

                map.current.on('load', () => {
                    if (!map) return;

                    loadCircuitLayers({
                        data: CIRCUIT_DETAILS,
                        map: map.current!,
                    });
                    map.current?.fitBounds(circuitBBox, {
                        padding: 20,
                        maxZoom: SHOW_PIN_ZOOM,
                    });
                });

                // Hide markers at the start of any animation/movement for smoother performance
                map.current?.on('movestart', () => {
                    hideAllMarkers(true); // Force hide all markers during animation
                });

                // Show markers again when animation/movement ends
                map.current.on('moveend', () => {
                    if (!mapContainer.current) return;

                    // Update UI coordinates
                    setLng(map.current?.getCenter().lng.toFixed(4) as unknown as number);
                    setLat(map.current?.getCenter().lat.toFixed(4) as unknown as number);
                    setZoom(map.current?.getZoom().toFixed(2) as unknown as number);

                    // Show markers again if zoom level is appropriate, using the throttled version
                    throttledMarkerVisibility(map.current?.getZoom() || SHOW_PIN_ZOOM);
                });

                // Additional handlers for specific animations
                map.current.on('zoomstart', () => hideAllMarkers(true));
                map.current.on('pitchstart', () => hideAllMarkers(true));
                map.current.on('rotatestart', () => hideAllMarkers(true));
                map.current.on('dragstart', () => hideAllMarkers(true));

                // During movement, do nothing to avoid performance issues
                const moveHandler = () => {
                    // Intentionally empty - we manage markers at the start/end of movements instead
                };

                map.current.on('move', moveHandler);

                // Clean up on unmount
                return () => {
                    // Remove all event listeners to prevent memory leaks
                    const hideMarkersHandler = () => hideAllMarkers(true);
                    map.current?.off('movestart', hideMarkersHandler);
                    map.current?.off('moveend', () => {
                        if (!mapContainer.current) return;
                        throttledMarkerVisibility(map.current?.getZoom() || SHOW_PIN_ZOOM);
                    });
                    map.current?.off('zoomstart', hideMarkersHandler);
                    map.current?.off('pitchstart', hideMarkersHandler);
                    map.current?.off('rotatestart', hideMarkersHandler);
                    map.current?.off('dragstart', hideMarkersHandler);
                    map.current?.off('move', moveHandler);

                    // Remove the map instance completely
                    map.current?.remove();
                };
            }
        } catch (error) {
            dispatch(setError(true));
            console.error('Error creating map:', error);
        }
    }, [mapContainer]);

    const [lat, setLat] = useState<number>(42.35);
    const [lng, setLng] = useState<number>(-70.9);
    const [zoom, setZoom] = useState<number>(9);

    const mapInfo = () => {
        const returnJSX = [];

        returnJSX.push(
            <div key={returnJSX.length + 1}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>,
        );

        return returnJSX;
    };

    const toolClasses = 'absolute z-20 p-2 rounded-md top-2 bg-opacity-40';

    return (
        <PageContainer title="Circuits" showBreadcrumbs showTitle>
            {/* NEW MAP! */}
            <div
                className="z-10"
                ref={mapContainer}
                style={{
                    width: '100%',
                    height: '70vh',
                }}
            />
            {/* </newMap> */}

            <div className={`${toolClasses} left-2 flex gap-4`}>
                <CircuitSelect
                    circuitsData={CIRCUIT_DETAILS || []}
                    circuit={circuit || CIRCUIT_DETAILS['baku']}
                    map={map.current}
                    setCircuit={setCircuit}
                    setContinent={setContinent}
                    gotoCircuit={gotoCircuit}
                />
                <ContinentSelect
                    continent={continent || 'Europe'}
                    map={map.current || null}
                    setCircuit={(circuit) => setCircuit(circuit || CIRCUIT_DETAILS['baku'])}
                    setContinent={setContinent}
                    gotoContinent={gotoContinent}
                />
            </div>

            <div className={`${toolClasses} right-2 bg-zinc-800 border border-zinc-700`}>{mapInfo()}</div>
        </PageContainer>
    );
};

export default Circuits;
