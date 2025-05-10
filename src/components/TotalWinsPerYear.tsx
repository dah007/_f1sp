import { FULL_ROW_HEIGHT, YEAR } from '@/constants/constants';
import { useGetTotalWinsByYearQuery } from '@/features/driversApi';
import { TotalWinsByYear } from '@/types/drivers';
import { useEffect, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '@/lib/utils';

const TotalWinsPerYear: React.FC = ({ className }: { className?: string }): JSX.Element => {
    const { data, isLoading, error } = useGetTotalWinsByYearQuery(YEAR);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const [totalWinsByYear, setTotalWinsByYear] = useState<TotalWinsByYear[]>([]);

    useEffect(() => {
        if (!data) return;
        console.log('Total wins by year:', data);
        setTotalWinsByYear(data);
    }, [data]);

    return (
        <ScrollArea className={cn(FULL_ROW_HEIGHT, 'overflow-hidden border-t', className)}>
            <Table>
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
