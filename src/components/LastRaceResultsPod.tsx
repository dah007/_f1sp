import { cn } from '@/lib/utils';
import { RootState, useAppSelector } from 'app/store';
import { JSX } from 'react';
import type { RaceResultProps } from 'types/races';
import CardSkeleton from './CardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const LastRaceResultsPod: React.FC = (): JSX.Element => {
    const driverOfTheDay = useAppSelector((state: RootState) => state.drivers.driversOfTheDay) || [];
    const raceResults: RaceResultProps[] = useAppSelector((state: RootState) => state.races.lastRaceResults) ?? [];

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

    const DriverOfTheDay = () => {
        if (driverOfTheDay && driverOfTheDay.length > 0) {
            return <>Driver of the day: {driverOfTheDay[0].name}</>;
        }

        return <Skeleton className="h-[20px] w-[100px] rounded-full bg-white" />;
    };

    if (!raceResults) return <CardSkeleton />;

    return (
        <div className="flex flex-col items-center justify-between py-2w-full">
            <div
                className="
                text-sm
                text-center 
                font-bold 
                flex items-center justify-center gap-4
                pb-2
            "
            >
                <DriverOfTheDay />
            </div>
            {!raceResults && <CardSkeleton />}

            <ScrollArea
                className={cn('lg:h-[28vh] md:h-[28vh] h-[16vh]', 'overflow-hidden border-t w-full', 'mb-[200px]')}
            >
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
        </div>
    );
};

export default LastRaceResultsPod;
