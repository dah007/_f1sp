import { ExtendedColumnDef } from '@/types/dataTable';
import type { RaceResultProps } from '@/types/races';
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
import Flag from '../Flag';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const LastResultsTable: React.FC<{ lastRace: RaceResultProps[] }> = ({ lastRace }) => {
    const colDefs = (): ColumnDef<RaceResultProps>[] => [
        {
            accessorKey: 'countryId',
            cell: ({ row }) => {
                return (
                    <div className="min-w-8 w-8 max-w-8">{Flag({ nameAsId: row.getValue('countryId'), size: 24 })}</div>
                );
            },
            size: 8,
            header: () => <div></div>,
        },
        {
            accessorKey: 'driver_name',
            cell: ({ row }) =>
                LinkRenderer({
                    gotoCB: () => `/drivers/${row.getValue('driver_id')}`,
                    label: row.getValue('driver_name'),
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
            accessorKey: 'grid_position_number',
            cell: ({ row }) => <div className="w-6">{row.getValue('grid_position_number')}</div>,
            header: ({ column }) => {
                return (
                    <>
                        <Button
                            variant="ghost"
                            className="flex"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Start Position
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                );
            },
            maxSize: 40,
        },
        {
            accessorKey: 'position_number',
            cell: ({ row }) => <div className="w-6">{row.getValue('position_number')}</div>,
            header: ({ column }) => {
                return (
                    <>
                        <Button
                            variant="ghost"
                            className="flex"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Finish Position
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                );
            },
        },
        {
            accessorKey: 'time',
            size: 40,
            cell: ({ row }) => <div className="text-right">{row.getValue('time')}</div>,
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
            accessorKey: 'interval',
            size: 40,
            cell: ({ row }) => <div>{row.getValue('interval') ?? '-'}</div>,
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
            accessorKey: 'gap',
            size: 40,
            cell: ({ row }) => <div>{row.getValue('gap') !== null ? row.getValue('gap') : '-'}</div>,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Gap
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
            accessorKey: 'points',
            cell: ({ row }) => <div className="text-right">{row.getValue('points') ?? '-'}</div>,
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Points
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                );
            },
        },
    ];

    const table = useReactTable({
        columns: colDefs(),
        data: lastRace || [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            pagination: pagination,
        },
        rowCount: Number(lastRace?.length) ?? 0,
        initialState: {
            columnVisibility: GetInVisibleColumn(colDefs() as unknown as ExtendedColumnDef[]),
        },
    });

    // if (!lastRaceResults) return <></>;

    return (
        <>
            <h2 className="text-xl font-bold mb-2 krona-one-regular">Race Results {lastRace[0]?.year}</h2>

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
        </>
    );
};
export default LastResultsTable;
