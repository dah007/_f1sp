import { FULL_ROW_HEIGHT } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { Scrollbar } from '@radix-ui/react-scroll-area';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { useGetLastRaceResultsQuery } from 'features/raceApi';
import { JSX, useEffect } from 'react';
import { setLastRaceResults } from 'slices/racesSlice';
import type { RaceResultProps } from 'types/races';
import CardSkeleton from './CardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const LastRaceResultsPod: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];
    // Only used here, to get the last race id
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;

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

    const RaceResults = ({ raceResults }: { raceResults: RaceResultProps[] }) => {
        // Check if raceResults is not an array and return null instead of a fragment with key
        if (!Array.isArray(raceResults)) return null;

        // Handle empty array case
        if (raceResults.length === 0) {
            return (
                <TableRow key="no-data">
                    <TableHead colSpan={5} className="text-center">
                        No data available
                    </TableHead>
                </TableRow>
            );
        }

        // Map through race results with proper keys
        return raceResults.map((race: RaceResultProps, index) => {
            const uniqueKey = `${index}-${race.permanent_number || index}`;

            return (
                <TableRow key={uniqueKey}>
                    <TableCell className="w-2 text-right">{race.position_text}</TableCell>
                    <TableCell className="cursor-pointer text-bolder">{race.driver_name}</TableCell>
                    <TableCell className="w-2 text-right">{race.gap}</TableCell>
                    <TableCell className="w-2 text-right">{race.points}</TableCell>
                </TableRow>
            );
        });
    };

    if (dataIsLoading || !dataResults) return <CardSkeleton />;

    return (
        <ScrollArea className={cn(FULL_ROW_HEIGHT, 'overflow-hidden border-t', 'mb-40')}>
            <Scrollbar className="h-full" />
            {dataIsLoading && <CardSkeleton />}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2 text-right">Pos</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead className="w-2 text-right">Gap</TableHead>
                        <TableHead className="w-2 text-right">Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <RaceResults raceResults={raceResults} />
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default LastRaceResultsPod;
