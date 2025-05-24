import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { useEffect } from 'react';

import { useGetConstructorStandingsQuery } from 'features/standingsApi';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

import { setError, setLoading } from 'slices/siteWideSlice';
import { setConstructorStandings } from 'slices/standingsSlice';

import { cn } from '@/lib/utils';
import { FULL_ROW_HEIGHT, YEAR } from 'constants/constants';
import { type ConstructorStanding } from 'types/standings';
import CardSkeleton from './CardSkeleton';

/**
 * Standings of constructors in a table format.
 *
 * Fetches constructor standings data using the useGetConstructorStandingsQuery hook
 * for a specified year (defaults to the current year). It displays a loading skeleton while
 * fetching data and an error message if no data is available.
 *
 * @component
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional CSS class names for the component
 * @param {number} [props.year] - The year for which to fetch constructor standings (defaults to current year)
 * @returns {JSX.Element} A scrollable table displaying constructor standings ordered by position,
 *                        showing position number, constructor name, and points
 */
const ConstructorStandings = ({ className, year = YEAR }: { className?: string; year?: number }): JSX.Element => {
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
        <ScrollArea className={cn(FULL_ROW_HEIGHT, className, 'overflow-hidden border-t', 'mb-40')}>
            <Table className="w-full mb-10">
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
                            &nbsp;
                        </TableCell>
                    </TableRow>
                    {/* ? basically just a footer spacer */}
                    <TableRow>
                        <TableCell className="text-right" colSpan={3}>
                            &nbsp;
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default ConstructorStandings;
