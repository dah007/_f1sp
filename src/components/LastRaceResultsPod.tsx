import { JSX, useEffect } from 'react';

import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from 'features/raceApi';

import { FULL_ROW_HEIGHT } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { setLastRaceResults, setRaceWGP } from 'slices/racesSlice';
import { setError, setLoading } from 'slices/siteWideSlice';
import type { RaceProps, RaceResultProps } from 'types/races';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const LastRaceResultsPod: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;

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
                    <TableCell className="w-2 text-right">{race.position_text}</TableCell>
                    <TableCell className="cursor-pointer text-bolder">{race.driver_name}</TableCell>
                    <TableCell className="w-2 text-right">{race.gap}</TableCell>
                    <TableCell className="w-2 text-right">{race.points}</TableCell>
                </TableRow>
            );
        });
    };

    return (
        <ScrollArea className={cn(FULL_ROW_HEIGHT, 'overflow-hidden border-t', 'mb-40')}>
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
