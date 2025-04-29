import { useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useGetConstructorStandingsQuery } from 'features/standingsApi';

import { setConstructorStandings } from 'slices/standingsSlice';
import { setError } from 'slices/siteWideSlice';

import { YEAR } from 'constants/constants';
import { type ConstructorStanding } from 'types/standings';
import { cn } from '@/lib/utils';

const ConstructorStandings = ({ className, year = YEAR }: { className?: string; year?: number }): JSX.Element => {
    const dispatch = useAppDispatch();
    const constructorStandings = useAppSelector((state: RootState) => state.standings.constructors);

    const { data: constructorStandingsData, isError: constructorStandingsIsError } = useGetConstructorStandingsQuery(
        year,
    ) as {
        data: ConstructorStanding[] | undefined;
        isLoading?: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (constructorStandingsIsError) {
            dispatch(setError(true));
            return;
        }
        if (!constructorStandingsData) return;
        console.log('constructorStandingsData', constructorStandingsData);
        dispatch(setConstructorStandings(constructorStandingsData));
    }, [constructorStandingsData, dispatch]);

    if (!constructorStandings) {
        return <div className="text-center italic">No constructors standings available.</div>;
    }
    return (
        <ScrollArea className={cn(`w-full border-t mb-40`, className)}>
            <Table>
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
                    {/* ? basically just a footer spacer */}
                    <TableRow>
                        <TableCell className="text-right" colSpan={3}>
                            &nsp;
                        </TableCell>
                    </TableRow>
                    {/* ? basically just a footer spacer */}
                    <TableRow>
                        <TableCell className="text-right" colSpan={3}>
                            &nsp;
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default ConstructorStandings;
