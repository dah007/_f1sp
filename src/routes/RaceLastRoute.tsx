import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import LastResultsTable from '@/components/Race/LastResultsTable';
import PreviousResultsTable from '@/components/Race/PreviousResultsTable';
import RaceDetailHeader from '@/components/Race/RaceDetailHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from '@/features/raceApi';
import { setLastRaceResults, setRaceWGP } from '@/slices/racesSlice';
import { setError, setLoading } from '@/slices/siteWideSlice';
import type { RaceProps, RaceResultProps } from '@/types/races';
import { getGeoJsonData } from '@/utils/locations';
import { useEffect, useState } from 'react';

const RaceLastRoute = () => {
    const dispatch = useAppDispatch();

    const [openedAccordion, setOpenedAccordion] = useState<string | null>(null);
    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.GeoJSON | null>(null);
    // const [raceResults, setRaceResults] = useState<RaceResultProps[]>([]);

    // Only used here, to get the last race id
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as RaceProps | null;

    const {
        data: raceWGPData,
        isLoading: raceWGPisLoading,
        isError: raceWGPisError,
    } = useGetRaceWithGPQuery(parseInt(nextRace?.id as unknown as string, 10) - 1 || 0) as {
        data: Partial<RaceProps> | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (raceWGPisError) {
            dispatch(setError(true));
            return;
        }
        if (raceWGPisLoading) dispatch(setLoading(true));
        if (!raceWGPData) return;
        dispatch(setRaceWGP(raceWGPData));
        dispatch(setLoading(false));
    }, [raceWGPData, raceWGPisError, raceWGPisLoading, dispatch]);

    const {
        data: dataResults,
        isLoading: dataIsLoading,
        isError: dataIsError,
    } = useGetLastRaceResultsQuery(parseInt(nextRace?.id as unknown as string, 10) - 1 || 0) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (dataIsError) {
            dispatch(setError(true));
            return;
        }
        if (dataIsLoading) dispatch(setLoading(true));
        if (!dataResults) return;
        dispatch(setLastRaceResults(dataResults));
        dispatch(setLoading(false));
    }, [dataResults, dataIsError, dataIsLoading, dispatch]);

    useEffect(() => {
        if (geoJsonData !== null) return;

        if (raceWGP?.circuit_id) {
            console.log('Fetching GeoJSON data for circuit:', raceWGP.circuit_id);
            getGeoJsonData(raceWGP.circuit_id)
                .then((data) => {
                    console.log('GeoJSON data fetched:', data);
                    if (data) {
                        setGeoJsonData(data as GeoJSON.GeoJSON);
                    } else {
                        console.error('Failed to load GeoJSON data for circuit:', raceWGP.circuit_id);
                        setGeoJsonData(null);
                    }
                })
                .catch((error) => {
                    console.error('Error loading GeoJSON data:', error);
                    setGeoJsonData(null);
                });
        }
    }, [raceWGP?.circuit_id]);

    if (!raceWGP) return <></>;

    const circuitDetails = CIRCUIT_DETAILS[raceWGP.circuit_id as keyof typeof CIRCUIT_DETAILS];

    const openAccordion = (which: string) => {
        if (!which) return;
        setOpenedAccordion(which);
    };

    return (
        <>
            <div className="flex flex-col justify-between items-center m-0 p-0 pb-8 bg-zinc-800 border-b border-zinc-700">
                <RaceDetailHeader race={raceWGP as unknown as RaceProps} />
                <div className="flex justify-evenly items-center gap-4 w-full p-4">
                    <div>
                        <div className="text-xl font-bold r-2 krona-one-regular">When?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {raceWGP.date} @ {raceWGP.time || 'TBD'} local time
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Where?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {circuitDetails?.place_name || 'N/A'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {raceWGP.round || 'TBD'} of {raceWGP.total_rounds || 'TBD'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {(circuitDetails?.length ?? 1) / 1000 || 'TBD'} km
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">More Info</div>
                        <div className="pl-4">
                            <a
                                className="text-blue-500 hover:underline"
                                href="#race-results"
                                onClick={() => openAccordion('race-results')}
                            >
                                Last
                            </a>{' '}
                            |{' '}
                            <a
                                className="text-blue-500 hover:underline"
                                onClick={() => openAccordion('previous-results')}
                                href="#previous-results"
                            >
                                Previous
                            </a>{' '}
                            |{' '}
                            {raceWGP?.circuit_id &&
                                CIRCUIT_DETAILS[raceWGP.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                                    <a
                                        className="text-blue-500 hover:underline"
                                        href={
                                            CIRCUIT_DETAILS[raceWGP.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ??
                                            ''
                                        }
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        WiKi
                                    </a>
                                )}
                        </div>
                    </div>

                    <div>
                        <img
                            className="max-w-[300px]"
                            alt={raceWGP.official_name || raceWGP.circuit_id}
                            src={`/assets/tracks/${raceWGP.circuit_id}.png`}
                        />
                    </div>
                </div>
            </div>
            {/* ? END HEADER! */}

            <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={openedAccordion!}
                    onValueChange={setOpenedAccordion}
                >
                    <AccordionItem value="race-results">
                        <AccordionTrigger className=" rounded-none">
                            <h2 className="text-xl font-bold mb-2 krona-one-regular">
                                Race Results {dataResults ? dataResults[0]?.year : ''}
                            </h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <LastResultsTable circuitId={dataResults ? dataResults[0].circuit_id : ''} />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="previous-results">
                        <AccordionTrigger className="border-b-1 border-zinc-500 rounded-none">
                            <h2 className="text-xl font-bold mb-2 krona-one-regular">Previous Results</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <PreviousResultsTable circuitId={dataResults ? dataResults[0].circuit_id : ''} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
};
export default RaceLastRoute;
