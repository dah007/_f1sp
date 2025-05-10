// import { RootState, useAppSelector } from 'app/store';
// import { useAppDispatch } from 'hooks/reduxHooks';
// import { useEffect, useRef, useState } from 'react';

// import type { Map } from 'mapbox-gl';
// const mapboxgl = () => import('mapbox-gl').then((module) => module.default);
// const mapboxInstance: (typeof import('mapbox-gl'))['default'] = await mapboxgl();

// import {
//     gotoCircuit,
//     gotoContinent,
//     loadCircuitLayers,
//     SHOW_PIN_ZOOM,
//     updateMarkerVisibility,
// } from './CircuitFunctions';

// import CircuitSelect from 'components/CircuitSelect';
// import ContinentSelect from './ContinentSelect';
// import PageContainer from 'components/PageContainer';

// import { setError } from 'slices/siteWideSlice';

// import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
// import { type CircuitProps } from 'types/circuits';

// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// const Circuits: React.FC = (): JSX.Element => {
//     const [lat, setLat] = useState<string | number | undefined>(42.35);
//     const [lng, setLng] = useState<string | number | undefined>(-70.9);
//     const [zoom, setZoom] = useState<string | number | undefined>(9);

//     const dispatch = useAppDispatch();

//     const circuitsMap = useRef<HTMLDivElement | null>(null);
//     const mapContainer = useRef<Map | null>(null);
//     const raceNext = useAppSelector((state: RootState) => state.races.raceNext);

//     const [circuit, setCircuit] = useState(CIRCUIT_DETAILS['baku']);
//     const [circuitBBox, setCircuitBBox] = useState<CircuitProps['bbox']>(CIRCUIT_DETAILS['baku']?.bbox);
//     const [continent, setContinent] = useState<string | undefined>('Europe');

//     // ? begin map
//     useEffect(() => {
//         if (!circuitsMap.current) return;
//         if (!mapboxInstance) return;

//         if (raceNext) {
//             setCircuitBBox(CIRCUIT_DETAILS[raceNext.circuit_id]?.bbox);
//             setCircuit(CIRCUIT_DETAILS[raceNext.circuit_id]);
//         }

//         try {
//             mapContainer.current = new mapboxInstance.Map({
//                 container: circuitsMap.current as string | HTMLElement,
//                 style: 'mapbox://styles/mapbox/dark-v11',
//                 center: [circuit?.longitude || 0, circuit?.latitude || 0],
//                 zoom: 9,
//             });
//         } catch (error: unknown) {
//             console.error('Error creating map:', error);
//             dispatch(setError(true));
//         }
//         if (!mapContainer.current) return;

//         mapContainer.current.on('load', () => {
//             if (!mapContainer.current) return;
//             loadCircuitLayers({
//                 data: CIRCUIT_DETAILS,
//                 mapContainer: mapContainer.current,
//             });
//             mapContainer.current?.fitBounds(circuitBBox, {
//                 padding: 20,
//                 maxZoom: SHOW_PIN_ZOOM,
//             });
//         });

//         const moveHandler = () => {
//             if (!mapContainer.current) return;

//             setLng(mapContainer.current?.getCenter().lng.toFixed(4));
//             setLat(mapContainer.current?.getCenter().lat.toFixed(4));
//             setZoom(mapContainer.current?.getZoom().toFixed(2));
//             updateMarkerVisibility(mapContainer.current?.getZoom() || SHOW_PIN_ZOOM);
//         };

//         mapContainer.current.on('move', moveHandler);

//         return () => {
//             mapContainer.current!.off('move', moveHandler);
//             mapContainer.current!.remove();
//         };
//     }, [dispatch, CIRCUIT_DETAILS, raceNext, mapboxInstance]);

//     const mapInfo = () => {
//         const returnJSX = [];

//         returnJSX.push(
//             <div key={returnJSX.length + 1}>
//                 Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
//             </div>,
//         );

//         return returnJSX;
//     };

//     const toolClasses = 'absolute z-20 p-2 rounded-md top-2 bg-opacity-40';

//     return (
//         <PageContainer title="Circuits" showBreadcrumbs showTitle>
//             {/* upper right dropdowns    */}
//             <div className={`${toolClasses} left-2 flex gap-4`}>
//                 <CircuitSelect
//                     circuitsData={CIRCUIT_DETAILS || []}
//                     circuit={circuit || CIRCUIT_DETAILS['baku']}
//                     map={mapContainer.current}
//                     setCircuit={setCircuit}
//                     setContinent={setContinent}
//                     gotoCircuit={gotoCircuit}
//                 />
//                 <ContinentSelect
//                     continent={continent || 'Europe'}
//                     map={mapContainer.current}
//                     setCircuit={(circuit) => setCircuit(circuit || CIRCUIT_DETAILS['baku'])}
//                     setContinent={setContinent}
//                     gotoContinent={gotoContinent}
//                 />
//             </div>

//             <div className={`${toolClasses} right-2 bg-zinc-800 border border-zinc-700`}>{mapInfo()}</div>

//             <div
//                 className="z-10"
//                 ref={circuitsMap}
//                 style={{
//                     width: '100%',
//                     height: '70vh',
//                 }}
//             />

//             {/* <div id="menu">
//                 <Input id="satellite-streets-v12" type="radio" name="rtoggle" value="satellite" checked /> */}
//             {/* <!-- See a list of Mapbox-hosted public styles at -->
//         <!-- https://docs.mapbox.com/api/maps/styles/#mapbox-styles --> */}

//             {/* <div span="flex left">
//                     <Label htmlFor="light-v11">light</Label>
//                     <input id="dark-v11" type="radio" name="rtoggle" value="dark" />
//                     <Label htmlFor="dark-v11">dark</Label>
//                     <input id="streets-v12" type="radio" name="rtoggle" value="streets" />
//                     <Label htmlFor="streets-v12">streets</Label>
//                     <input id="outdoors-v12" type="radio" name="rtoggle" value="outdoors" />
//                     <Label htmlFor="outdoors-v12">outdoors</Label>
//                 </div>
//             </div> */}
//         </PageContainer>
//     );
// };

// export default Circuits;

const Circuits: React.FC = (): JSX.Element => {
    return (
        <div>
            <h1>Circuits</h1>
            <p>Technical issues, but worry not! Coming soon.</p>
        </div>
    );
};
export default Circuits;
