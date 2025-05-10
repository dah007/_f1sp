import { JSX, useEffect } from 'react';

import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from 'features/raceApi';

import type { RaceProps, RaceResultProps } from 'types/races';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { setLastRaceResults, setRaceWGP } from 'slices/racesSlice';
import { setError } from 'slices/siteWideSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { FULL_ROW_HEIGHT } from '@/constants/constants';

const LastRaceResultsPod: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    // const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;

    const { data: raceWGPData } = useGetRaceWithGPQuery(parseInt(nextRace?.id as unknown as string, 10) - 1 || 0) as {
        data: Partial<RaceProps> | undefined;
        isError: boolean;
    };
    useEffect(() => {
        if (!raceWGPData) return;
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
                    <TableCell className="w-2 text-right">{race.position_text}</TableCell>
                    <TableCell className="w-2 text-right">{race.driver_number}</TableCell>
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
                        <TableHead className="w-2 text-right">No</TableHead>
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
