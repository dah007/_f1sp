import { useAppDispatch } from '@/app/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetPreviousFirstPlaceResultsQuery } from '@/features/raceApi';
import { setError } from '@/slices/siteWideSlice';
import { ExtendedColumnDef } from '@/types/dataTable';
import { RaceResultProps } from '@/types/races';
import { LinkRenderer } from '@/utils/dataTableRenderers';
import { GetInVisibleColumn, pagination } from '@/utils/tables';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../Button';
import Flag from '../Flag';

const PreviousResultsTable: React.FC<{ circuitId: string }> = ({
    circuitId,
    // setRaceResults,
}): JSX.Element => {
    const dispatch = useAppDispatch();

    const [raceResults, setRaceResults] = useState<RaceResultProps[]>([]);

    const colDefs = (): ColumnDef<RaceResultProps>[] => [
        {
            accessorKey: 'date',
            cell: ({ row }) => <div className="text-right">{row.getValue('date')}</div>,
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Date
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'result_time',
            size: 40,
            cell: ({ row }) => <div className="text-right">{row.getValue('result_time')}</div>,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Time
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'year',
            cell: ({ row }) => (
                <div
                    // onClick={() => (location.href = `/drivers/${row.original.id}`)}
                    className="cursor-pointer hover:text-blue-500"
                >
                    {row.getValue('year')}
                </div>
            ),
            size: 40,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Year
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'driverNationality',
            cell: ({ row }) => {
                return (
                    <div className="min-w-8 w-8 max-w-8">
                        {Flag({ cCode: row.getValue('driverNationality'), size: 24 })}
                    </div>
                );
            },
            size: 8,
            header: () => <div></div>,
        },
        {
            accessorKey: 'driver',

            cell: ({ row }) =>
                LinkRenderer({
                    gotoCB: () => `/drivers/${row.getValue('driver_id')}`,
                    label: row.getValue('driver'),
                    value: row.original.id as unknown as string,
                }),
            size: 40,
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'laps',
            cell: ({ row }) => {
                return <div className="min-w-8 w-8 max-w-8">{row.getValue('laps')}</div>;
            },
            size: 40,
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Laps
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'sprint_qualifying_time',
            cell: ({ row }) => {
                return (
                    <div className="min-w-8 w-8 max-w-8">
                        {row.getValue('sprint_qualifying_time') ? row.getValue('sprint_qualifying_time') : '-'}
                    </div>
                );
            },
            size: 40,
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Sprint Quali Time
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'sprint_qualifying_date',
            cell: ({ row }) => (
                <div className="text-right">
                    {row.getValue('sprint_qualifying_date') ? row.getValue('sprint_qualifying_date') : '-'}
                </div>
            ),
            header: ({ column }) => {
                return (
                    <>
                        <Button
                            variant="ghost"
                            className="flex"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Champ Pos
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                );
            },
        },
        {
            accessorKey: 'constructors_championship_decider',
            cell: ({ row }) => (
                <div className="text-right">{row.getValue('constructors_championship_decider') ? 'Yes' : 'No'}</div>
            ),
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Fastest Laps
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                );
            },
        },
    ];

    const {
        data: previousFirstPlaceResults,
        isLoading: previousFirstPlaceResultsLoading,
        isError: previousFirstPlaceResultsError,
    } = useGetPreviousFirstPlaceResultsQuery(circuitId) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    const table = useReactTable({
        columns: colDefs(),
        data: raceResults || [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            pagination: pagination,
        },
        rowCount: raceResults?.length ?? 0,
        initialState: {
            columnVisibility: GetInVisibleColumn(colDefs() as unknown as ExtendedColumnDef[]),
        },
    });

    useEffect(() => {
        if (previousFirstPlaceResultsError) {
            console.error('>>>>> Error fetching previous first place results:', previousFirstPlaceResultsError);
            dispatch(setError(true));
            return;
        }
        if (previousFirstPlaceResultsLoading) {
            console.log('Loading previous first place results...');
            return;
        }
        if (!previousFirstPlaceResults) return;

        setRaceResults(previousFirstPlaceResults);
        console.log('Previous first place results fetched successfully:', previousFirstPlaceResults);
    }, [previousFirstPlaceResults, previousFirstPlaceResultsError, previousFirstPlaceResultsLoading, dispatch]);

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-2 krona-one-regular">Previous Results</h2>
            <Table className="w-full">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                data-driver-id={row.original.id}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow key="no-results">
                            <TableCell colSpan={colDefs.length} className="h-24 text-center" key="nope-none">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
export default PreviousResultsTable;
