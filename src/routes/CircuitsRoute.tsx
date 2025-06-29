import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { setError } from '@/slices/systemWideSlice';
import PageContainer from 'components/PageContainer';
import { useAppDispatch } from 'hooks/reduxHooks';
import mapboxgl from 'mapbox-gl';
import { JSX, useEffect, useRef, useState } from 'react';
import {
    gotoCircuit,
    gotoContinent,
    loadCircuitLayers,
    SHOW_PIN_ZOOM,
    updateMarkerVisibility,
} from './Circuits/CircuitFunctions';

import CircuitSelect from '@/components/CircuitSelect';
import ContinentSelect from '@/components/ContinentSelect';
import { CircuitProps } from 'types/circuits';

const Circuits: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const mapContainer = useRef<HTMLDivElement>(null);

    const [circuit, setCircuit] = useState(CIRCUIT_DETAILS['baku']);
    const [circuitBBox /*, setCircuitBBox*/] = useState<CircuitProps['bbox']>(CIRCUIT_DETAILS['baku']?.bbox);
    const [continent, setContinent] = useState<string | undefined>('Europe');

    const map = useRef<mapboxgl.Map | null>(null);
    const [lat, setLat] = useState<number>(42.35);
    const [lng, setLng] = useState<number>(-70.9);
    const [zoom, setZoom] = useState<number>(9);

    useEffect(() => {
        try {
            setLng(-1.02602);
            setLat(52.09216);
            if (mapContainer.current) {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/dark-v11',
                    center: [-1.02602, 52.09216], // Silverstone, UK
                    zoom,
                    maxZoom: 15,
                    renderWorldCopies: true, // Better handling of markers at map edges
                    fadeDuration: 0, // Reduces lag when moving
                    trackResize: true,
                    attributionControl: false, // We'll add this separately if needed
                    antialias: true, // Smoother rendering
                    maxPitch: 60, // Limit pitch for better performance
                    minZoom: 2, // Limit min zoom for better performance
                    preserveDrawingBuffer: false, // Better performance
                });

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

                map.current.on('moveend', () => {
                    if (!mapContainer.current) return;
                    // Update UI coordinates
                    setLng(map.current?.getCenter().lng.toFixed(4) as unknown as number);
                    setLat(map.current?.getCenter().lat.toFixed(4) as unknown as number);
                    setZoom(map.current?.getZoom().toFixed(2) as unknown as number);
                });

                // During movement, do nothing to avoid performance issues
                const moveHandler = () => {
                    // Intentionally empty - we manage markers at the start/end of movements instead
                    updateMarkerVisibility(map.current?.getZoom() || 14);
                };

                map.current.on('move', moveHandler);

                // Clean up on unmount
                return () => {
                    map.current?.off('move', moveHandler);
                    map.current?.remove();
                };
            }
        } catch (error) {
            dispatch(setError(true));
            console.error('Error creating map:', error);
            return;
        }
    }, [mapContainer, circuitBBox, dispatch, zoom]);

    const mapInfo = () => {
        const returnJSX = [];

        returnJSX.push(
            <div key={returnJSX.length + 1}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>,
        );

        return returnJSX;
    };

    const toolClasses = 'absolute z-20 p-2 rounded-md bg-opacity-40';

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

            <div className={`${toolClasses} top-2 left-2 flex gap-4`}>
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

            <div className={`${toolClasses} lg:top-2 right-2 bg-zinc-800 border border-zinc-700`}>{mapInfo()}</div>
        </PageContainer>
    );
};

export default Circuits;
