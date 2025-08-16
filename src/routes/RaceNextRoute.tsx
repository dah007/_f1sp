import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import LastResultsTable from '@/components/Race/LastResultsTable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { useGetNextRaceQuery } from '@/features/raceApi';
import { setRaceNext } from '@/slices/racesSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import type { RaceNextProps, RaceProps } from '@/types/races';
import { useEffect, useState } from 'react';
import PreviousResultsTable from '../components/Race/PreviousResultsTable';
import RaceDetailHeader from '../components/Race/RaceDetailHeader';

const RaceNextRoute = () => {
    const dispatch = useAppDispatch();

    const [openedAccordion, setOpenedAccordion] = useState<string | null>(null);

    // ? used to populate the header
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext);
    const { data: nextRaceData, isLoading: nextRaceLoading, isError: nextRaceError } = useGetNextRaceQuery(0);

    useEffect(() => {
        if (nextRaceError) {
            dispatch(setError(true));
            return;
        }
        if (nextRaceLoading) dispatch(setLoading(true));

        if (!nextRaceData) return;
        dispatch(setLoading(false));
        dispatch(setRaceNext(nextRaceData as RaceNextProps));
    }, [nextRace, dispatch, nextRaceData, nextRaceLoading, nextRaceError]);

    const circuitId = nextRace?.circuit_id || '';
    if (!nextRace) return <></>;

    console.log('nextRace:', nextRace);

    const circuitDetails = CIRCUIT_DETAILS[nextRace.circuit_id as keyof typeof CIRCUIT_DETAILS];

    if (!circuitDetails) return <></>;

    const openAccordion = (which: string) => {
        if (!which) return;
        setOpenedAccordion(which);
    };

    console.log('circuitDetails:', circuitDetails);

    return (
        <>
            <div className="flex flex-col justify-between items-center m-0 p-0 pb-8 border border-zinc-700 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl">
                <RaceDetailHeader race={nextRace as unknown as RaceProps} />
                <div className="flex justify-evenly items-center gap-4 w-full p-4">
                    <div>
                        <div className="text-xl font-bold r-2 krona-one-regular">When?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            11{nextRace.date} @ {nextRace.time || 'TBD'} local time
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Where?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {circuitDetails?.place_name || 'N/A'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {nextRace.round || 'TBD'} of {nextRace.total_rounds || 'TBD'}
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
                            {nextRace?.circuit_id &&
                                CIRCUIT_DETAILS[nextRace.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                                    <a
                                        className="text-blue-500 hover:underline"
                                        href={
                                            CIRCUIT_DETAILS[nextRace.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ??
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
                            alt={nextRace.official_name || nextRace.circuit_id}
                            src={`/assets/tracks/${nextRace.circuit_id}.png`}
                        />
                    </div>
                </div>
            </div>
            {/* ? END HEADER! */}

            <div className="w-full dark:border-zinc-500 pt-4">
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
                                Race Results {nextRace ? nextRace.year : ''}
                            </h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <LastResultsTable circuitId={circuitId} />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="previous-results">
                        <AccordionTrigger className="border-b-1 border-zinc-500 rounded-none">
                            <h2 className="text-xl font-bold mb-2 krona-one-regular">Previous Results</h2>
                        </AccordionTrigger>
                        <AccordionContent>
                            <PreviousResultsTable circuitId={circuitId} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
};

export default RaceNextRoute;
