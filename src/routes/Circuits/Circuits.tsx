import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import mapboxgl, { Map } from 'mapbox-gl';

import { useGetCircuitsQuery } from '../../features/circuitsApi';

import { CIRCUIT_DETAILS } from '../../constants/circuitConstants';

import type { CircuitProps } from 'types/circuits';

import 'mapbox-gl/dist/mapbox-gl.css';
import { setRaceNext } from '../../slices/racesSlice';
import { setError } from 'slices/siteWideSlice';
import PageContainer from 'components/PageContainer';
import {
    gotoCircuit,
    gotoContinent,
    loadCircuitLayers,
    SHOW_PIN_ZOOM,
    updateMarkerVisibility,
} from './CircuitFunctions';
import LoadingToast from '@/components/LoadingToast';
import CircuitSelect from '@/components/CircuitSelect';
import ContinentSelect from '@/components/ContinentSelect';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Circuits: React.FC = () => {
    const originalLabel = '-- Select a circuit --';
    const dispatch = useAppDispatch();

    const circuitsMap = useRef<HTMLDivElement | null>(null);
    const mapContainer = useRef<Map | null>(null);

    const [circuitsData, setCircuitsData] = useState<CircuitProps[]>();

    const [, setDropdownLabel] = useState<string>(originalLabel);

    const [lat, setLat] = useState<string | number | undefined>(42.35);
    const [lng, setLng] = useState<string | number | undefined>(-70.9);

    const [, setSelectedCircuit] = useState<CircuitProps>();
    const [zoom, setZoom] = useState<string | number | undefined>(9);

    const [circuit, setCircuit] = useState<CircuitProps | undefined>(CIRCUIT_DETAILS['baku']);
    const [continent, setContinent] = useState<string | undefined>('Europe');

    const {
        data: circuitData,
        isLoading,
        error,
    } = useGetCircuitsQuery({
        endYear: new Date().getFullYear(),
        startYear: new Date().getFullYear() - 10,
    });

    const raceNext = useAppSelector((state) => state.races.raceNext);

    // ? begin map
    useEffect(() => {
        if (!circuitsMap.current) return;
        if (!circuitData) return;

        let circuitBBox = CIRCUIT_DETAILS['baku']?.bbox;
        let circuit = circuitData.find((circuit: CircuitProps) => circuit.full_name === 'Baku City Circuit');

        if (raceNext) {
            circuitBBox = CIRCUIT_DETAILS[raceNext.circuit_id]?.bbox;
            circuit = circuitData.find((circuit: CircuitProps) => circuit.id === raceNext.circuit_id);
        }

        setDropdownLabel(circuit?.full_name);
        setSelectedCircuit(circuit);

        try {
            mapContainer.current = new mapboxgl.Map({
                container: circuitsMap.current as string | HTMLElement,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [circuit?.longitude || 0, circuit?.latitude || 0],
                zoom: 9,
            });
        } catch (error: unknown) {
            console.error('Error creating map:', error);
            dispatch(setError(true));
        }

        // ? set all circuit state var
        setCircuitsData(circuitData);

        if (!mapContainer.current) return;

        mapContainer.current.on('load', () => {
            if (!mapContainer.current) return;
            loadCircuitLayers({
                data: circuitData,
                mapContainer: mapContainer.current,
            });
        });

        mapContainer.current.fitBounds(circuitBBox, {
            padding: { top: 25, bottom: 25, left: 15, right: 15 },
        });

        mapContainer.current.on('move', () => {
            if (!mapContainer.current) return;

            setLng(mapContainer.current?.getCenter().lng.toFixed(4));
            setLat(mapContainer.current?.getCenter().lat.toFixed(4));
            setZoom(mapContainer.current?.getZoom().toFixed(2));
            updateMarkerVisibility(mapContainer.current?.getZoom() || SHOW_PIN_ZOOM);
        });

        return () => mapContainer.current!.remove();
    }, [dispatch, circuitData, raceNext]);
    // ? end map

    // if (isLoading) return <LoadingToast isLoading={raceNextLoading || isLoading} />;
    // if (error || raceNextError) dispatch(setError(true));

    const mapInfo = () => {
        const returnJSX = [];

        returnJSX.push(
            <div key={returnJSX.length + 1}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>,
        );

        return returnJSX;
    };

    return (
        <PageContainer title="Circuits" showBreadcrumbs showTitle>
            <div className="z-50 h-full relative w-full gap-4 rounded-md flex justify-around">
                <div className="absolute z-50 flex gap-2 rounded-md mapInfo top-2 left-2 right-2">
                    <CircuitSelect
                        circuitsData={circuitsData || []}
                        circuit={circuit || CIRCUIT_DETAILS['baku']}
                        map={mapContainer.current}
                        setCircuit={setCircuit}
                        setContinent={setContinent}
                        gotoCircuit={gotoCircuit}
                    />
                    <ContinentSelect
                        continent={continent || 'Europe'}
                        map={mapContainer.current}
                        setCircuit={setCircuit}
                        setContinent={setContinent}
                        gotoContinent={gotoContinent}
                    />
                </div>
                <div className="absolute z-50 p-2 bg-black rounded-md mapInfo top-2 right-2 bg-opacity-40">
                    {mapInfo()}
                </div>
                <div
                    className="rounded-lg z-40"
                    ref={circuitsMap}
                    style={{
                        width: '100%',
                        height: '70vh',
                    }}
                />
            </div>
        </PageContainer>
    );
};

export default Circuits;
