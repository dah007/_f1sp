import { JSX, useEffect } from 'react';

import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from 'features/raceApi';

import type { RaceProps, RaceResultProps } from 'types/races';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { setLastRaceResults, setRaceWGP } from 'slices/racesSlice';
import { setError } from 'slices/siteWideSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import CardContainer from './CardContainer';

/**
 * Component to display the last race results in a tabular format.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {number} [props.year=YEAR] - The year for which to fetch the last race results.
 * @returns {JSX.Element} A JSX element displaying the last race results.
 *
 * @example
 * <LastRaceResultsPod year={2023} />
 *
 * @remarks
 * This component uses Redux for state management and RTK Query for data fetching.
 * It dispatches actions to set the last race results and handle errors.
 * The component displays a loading state while fetching data and shows a message if no data is available.
 *
 * @requires useAppDispatch
 * @requires useAppSelector
 * @requires useGetLastRaceResultsQuery
 * @requires setLastRaceResults
 * @requires setError
 * @requires CardLoading
 * @requires Table
 * @requires TableHeader
 * @requires TableRow
 * @requires TableHead
 * @requires TableBody
 * @requires TableCell
 * @requires CustomLink
 */
const LastRaceResultsPod: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;

    const { data: raceWGPData } = useGetRaceWithGPQuery(parseInt(nextRace?.id as unknown as string, 10) - 1 || 0) as {
        data: Partial<RaceProps> | undefined;
        isError: boolean;
    };
    useEffect(() => {
        if (!raceWGPData) return;
        console.log('raceWGPData', raceWGPData);
        dispatch(setRaceWGP(raceWGPData));
    }, [raceWGPData, dispatch]);

    const { data: dataResults, isError } = useGetLastRaceResultsQuery(
        parseInt(nextRace?.id as unknown as string, 10) - 1 || 0,
    ) as {
        data: RaceResultProps[] | undefined;
        isError: boolean;
    };

    useEffect(() => {
        if (!dataResults) return;
        console.log('dataResults', dataResults);
        dispatch(setLastRaceResults(dataResults));
    }, [dataResults, dispatch]);

    if (isError) {
        dispatch(setError(true));
    }

    const RaceResults = ({ raceResults }: { raceResults: RaceResultProps[] }) => {
        if (!Array.isArray(raceResults)) return null;
        if (raceResults?.length === 0) {
            return (
                <TableRow>
                    <TableHead colSpan={5} className="text-center">
                        No data available
                    </TableHead>
                </TableRow>
            );
        }

        return raceResults?.map((race: RaceResultProps) => {
            return (
                <TableRow key={race.permanent_number}>
                    <TableCell className="w-4 text-right">{race.position_text}</TableCell>
                    <TableCell className="w-4 text-right">{race.driver_number}</TableCell>
                    <TableCell>{race.driver_name}</TableCell>
                    <TableCell className="w-4 text-right">{race.gap}</TableCell>
                    <TableCell className="w-4 text-right">{race.points}</TableCell>
                </TableRow>
            );
        });
    };

    return (
        <CardContainer
            className="overflow-hidden h-[30vh]"
            childrenClassName="w-full m-0 p-0 h-[30vh]"
            title={`Last Race: ${raceWGP ? raceWGP.short_name : 'N/A'}`}
        >
            <ScrollArea className="h-full w-full border-t">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-4 text-right">Pos</TableHead>
                            <TableHead className="w-4 text-right">No</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead className="w-4 text-right">Gap</TableHead>
                            <TableHead className="w-4 text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <RaceResults raceResults={raceResults} />
                    </TableBody>
                </Table>
            </ScrollArea>
        </CardContainer>
    );
};

export default LastRaceResultsPod;
