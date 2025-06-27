import { useAppDispatch } from '@/app/store';
import { FULL_ROW_HEIGHT, YEAR } from '@/constants/constants';
import { useGetTotalWinsByYearQuery } from '@/features/driversApi';
import { cn } from '@/lib/utils';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { TotalWinsByYear } from '@/types/drivers';
import { useEffect, useState } from 'react';
import CardSkeleton from './CardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

/**
 * Displays a table of drivers' total wins for a specific year.
 *
 * The component fetches data using the useGetTotalWinsByYearQuery hook, displays a loading skeleton
 * while data is being fetched, and presents the data in a scrollable table once available.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional CSS class name for additional styling
 * @returns {JSX.Element} A ScrollArea containing a Table of driver wins or a CardSkeleton while loading
 *
 * @example
 * ```tsx
 * <TotalWinsPerYear className="custom-class" />
 * ```
 */
const TotalWinsPerYear: React.FC = ({ className }: { className?: string }): JSX.Element => {
    const dispatch = useAppDispatch();

    const {
        data: totalWinsData,
        isLoading: totalWinsLoading,
        error: totalWinsError,
    } = useGetTotalWinsByYearQuery(YEAR);

    const [totalWinsByYear, setTotalWinsByYear] = useState<TotalWinsByYear[]>([]);

    useEffect(() => {
        if (totalWinsError) {
            dispatch(setError(true));
            return;
        }
        if (totalWinsLoading) dispatch(setLoading(true));
        if (!totalWinsData) return;

        setTotalWinsByYear(totalWinsData);
        dispatch(setError(false));
        dispatch(setLoading(false));
    }, [dispatch, totalWinsData, totalWinsLoading, totalWinsError]);

    if (totalWinsLoading || !totalWinsData) return <CardSkeleton />;

    return (
        <ScrollArea className={cn(FULL_ROW_HEIGHT, className, 'overflow-hidden border-t', 'mb-40')}>
            <Table className="w-full mb-10">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-4 text-right">Pos</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead className="w-4 text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {totalWinsByYear?.map((driver: TotalWinsByYear, index: number) => (
                        <TableRow key={`${driver.id}-${index}`} className="h-8">
                            <TableCell className="text-right">{index + 1}.</TableCell>
                            <TableCell>{driver.name}</TableCell>
                            <TableCell className="text-right">{driver.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default TotalWinsPerYear;
