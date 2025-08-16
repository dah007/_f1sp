import { cn } from '@/lib/utils';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { YEAR } from 'constants/constants';
import { useGetConstructorStandingsQuery } from 'features/standingsApi';
import { JSX, useEffect } from 'react';
import { setConstructorStandings } from 'slices/standingsSlice';
import { setError, setLoading } from 'slices/systemWideSlice';
import { type ConstructorStanding } from 'types/standings';
import CardSkeleton from './CardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const ConstructorStandingsTable = ({ className, year = YEAR }: { className?: string; year?: number }): JSX.Element => {
    const dispatch = useAppDispatch();

    const constructorStandings = useAppSelector((state: RootState) => state.standings.constructors);

    const {
        data: constructorStandingsData,
        isLoading: constructorStandingsIsLoading,
        isError: constructorStandingsIsError,
    } = useGetConstructorStandingsQuery(year) as {
        data: ConstructorStanding[] | undefined;
        isLoading?: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (constructorStandingsIsError) {
            dispatch(setError(true));
            return;
        }
        if (constructorStandingsIsLoading) dispatch(setLoading(true));
        if (!constructorStandingsData) return;

        dispatch(setConstructorStandings(constructorStandingsData));
        dispatch(setLoading(false));
    }, [constructorStandingsData, constructorStandingsIsLoading, constructorStandingsIsError, dispatch]);

    if (!constructorStandings) {
        return <div className="text-center italic">No constructors standings available.</div>;
    }

    if (constructorStandingsIsLoading || !constructorStandings) return <CardSkeleton />;

    return (
        <ScrollArea className={cn('lg:h-[28vh] md:h-[28vh] h-[20vh]', 'overflow-hidden border-t', 'mb-[200px]')}>
            <Table className={cn('w-full', className)}>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-4 text-right">Pos</TableHead>
                        <TableHead>Constructor</TableHead>
                        <TableHead className="w-4 text-right">Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {constructorStandings?.map((constructor: ConstructorStanding) => (
                        <TableRow key={constructor.constructor_id}>
                            <TableCell className="text-right">{constructor.position_number}</TableCell>
                            <TableCell>{constructor.full_name}</TableCell>
                            <TableCell className="text-right">{constructor.points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default ConstructorStandingsTable;
