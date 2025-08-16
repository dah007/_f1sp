/**
 * PreviousResultsTable Component
 *
 * This component displays a table of previous race results for a specific circuit.
 * It shows race winners by year with expandable rows to view all race results for that year.
 *
 * Features:
 * - Fetches and displays historical race results for a specific circuit
 * - Expandable rows to show all race results for a given year
 * - Sortable columns for different race statistics
 * - Uses React Table for efficient table rendering and management
 *
 * @param {string} circuitId - The ID of the circuit to fetch results for
 */

import { useAppDispatch } from '@/app/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetPreviousRaceResultsQuery, useGetRaceCountByCircuitQuery } from '@/features/raceApi';
import { setError } from '@/slices/systemWideSlice';
import { ExtendedColumnDef } from '@/types/dataTable';
import { RaceResultProps } from '@/types/races';
import { LinkRenderer } from '@/utils/dataTableRenderers';
import { intlNumberFormat } from '@/utils/number';
import { GetInVisibleColumn, groupWinnersWithChildren, Item } from '@/utils/tables';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChartSpline, ChevronDown, ChevronRight, FlagIcon, Medal } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Button from '../Button';
import Flag from '../Flag';

/**
 * PreviousResultsTable component displays historical race results for a specific circuit
 *
 * @param {Object} props - Component props
 * @param {string} props.circuitId - The ID of the circuit to fetch results for
 * @returns {JSX.Element} Rendered table component
 */
const PreviousResultsTable: React.FC<{ circuitId: string }> = ({
    circuitId,
}: {
    circuitId: string;
}): React.ReactElement => {
    const dispatch = useAppDispatch();

    // State for storing race results and metadata
    const [raceResults, setRaceResults] = useState<RaceResultProps[]>([]);
    const [totalRaceCount, setTotalRaceCount] = useState<number>(0);

    // Query to get the total number of races for this circuit
    const { data: raceTotalCountData } = useGetRaceCountByCircuitQuery(circuitId) as {
        data: number | undefined;
    };

    // Update total race count when data is received
    useEffect(() => {
        if (!raceTotalCountData) return;
        setTotalRaceCount(raceTotalCountData || 0);
    }, [raceTotalCountData]);

    /**
     * Defines the columns for the race results table
     *
     * @returns {ColumnDef<RaceResultProps>[]} Array of column definitions
     */
    const colDefs = (): ColumnDef<RaceResultProps>[] => [
        {
            header: ' ',
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <button onClick={row.getToggleExpandedHandler()} style={{ cursor: 'pointer' }}>
                        {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                    </button>
                ) : (
                    ''
                );
            },
        },
        {
            accessorKey: 'year',
            cell: ({ row }) => {
                return <div className="min-w-8 max-w-8 w-full text-center">{row.getValue('year')}</div>;
            },
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="cursor-pointer min-w-8 max-w-8 w-8"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    title="Year"
                >
                    <FlagIcon size={24} />
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'driverNationality',
            cell: ({ row }) => {
                return (
                    <div className="min-w-8 w-8 max-w-8">
                        <Flag cCode={row.getValue('driverNationality')} size={24} />
                    </div>
                );
            },
            size: 8,
            header: () => <div></div>,
        },
        {
            accessorKey: 'driver',

            cell: ({ row }) => (
                <div className="min-w-12 w-12 max-w-12">
                    {LinkRenderer({
                        gotoCB: () => `/drivers/${row.getValue('driver_id')}`,
                        label: row.getValue('driver'),
                        value: row.original.id as unknown as string,
                    })}
                </div>
            ),
            size: 40,
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="w-8 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'result_time',
            size: 15,
            cell: ({ row }) => <div className="text-right w-full">{row.getValue('result_time')}</div>,
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
            accessorKey: 'time_penalty',
            size: 15,
            cell: ({ row }) => (
                <div className="text-right w-full">{intlNumberFormat(row.getValue('time_penalty'))}</div>
            ),
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Penalty
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'gap',
            cell: ({ row }) => <div className="text-right">{row.getValue('gap') ? row.getValue('gap') : '-'}</div>,
            header: ({ column }) => {
                return (
                    <>
                        <Button
                            variant="ghost"
                            className="flex"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Gap
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                );
            },
            size: 10,
        },
        {
            accessorKey: 'interval',
            cell: ({ row }) => (
                <div className="text-right">{row.getValue('interval') ? row.getValue('interval') : '-'}</div>
            ),
            header: ({ column }) => {
                return (
                    <>
                        <Button
                            variant="ghost"
                            className="flex"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            Interval
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                );
            },
            size: 10,
        },
        {
            accessorKey: 'points',
            cell: ({ row }) => {
                return <div className="min-w-2 w-2 max-w-2">{row.getValue('points')}</div>;
            },
            size: 40,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="cursor-pointer w-6 max-w-6 min-w-6"
                    title="Points"
                >
                    <Medal size={24} />
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'positions_gained',
            cell: ({ row }) => {
                return <div className="min-w-2 w-2 max-w-2">{row.getValue('positions_gained')}</div>;
            },
            size: 40,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="cursor-pointer"
                    title="Positions Gained"
                >
                    <ChartSpline size={24} />
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'qualification_position_number',
            cell: ({ row }) => {
                return <div className="min-w-8 w-8 max-w-8">{row.getValue('qualification_position_number')}</div>;
            },
            size: 40,
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Qual Pos
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
        {
            accessorKey: 'pit_stops',
            cell: ({ row }) => (
                <div className="text-right">{row.getValue('pit_stops') ? row.getValue('pit_stops') : '-'}</div>
            ),
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Pit Stops
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                );
            },
        },
    ];

    // Query to fetch previous race results
    const {
        data: previousRaceResults,
        isLoading: previousRaceResultsLoading,
        isError: previousRaceResultsError,
    } = useGetPreviousRaceResultsQuery(circuitId) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    // Configure pagination based on the race count
    const pagination = useMemo(() => {
        return {
            pageIndex: 0,
            pageSize: totalRaceCount > 0 ? totalRaceCount : 10, // default page size
            // Show all results on a single page if possible
        };
    }, [totalRaceCount]);

    // Initialize and configure the table
    const table = useReactTable({
        columns: colDefs(),
        data: raceResults || [],
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // Return children array as sub-rows for expandable functionality
        getSubRows: (row) => (row as RaceResultProps).children as RaceResultProps[] | undefined,
        initialState: {
            columnVisibility: GetInVisibleColumn(colDefs() as unknown as ExtendedColumnDef[]),
            sorting: [
                {
                    id: 'year',
                    desc: true, // Sort by most recent years first
                },
            ],
        },
        paginateExpandedRows: false, // Do not include expanded rows in pagination calculation
        rowCount: raceResults?.length ?? 0,
        state: {
            pagination: pagination,
        },
    });

    // Commented pagination functionality - kept for potential future use
    // const gotoNext = () => {
    //     const nextPage = table.getState().pagination.pageIndex + 1;
    //     console.log('Next page:', nextPage);
    //     if (nextPage < table.getPageCount()) {
    //         console.log('Going to next page:', nextPage);
    //         table.setPageIndex(nextPage);
    //     }
    // };

    function getPositionOneWithChildren(records) {
        return records
            .filter((row) => row.position_number === 1)
            .map((parent) => ({
                ...parent,
                children: records.filter(
                    (child) => child.year === parent.year && child !== parent, // or child.id !== parent.id if you have unique ids
                ),
            }));
    }

    // Process race results when data is fetched
    useEffect(() => {
        if (previousRaceResultsError) {
            console.error('>>>>> Error fetching previous first place results:', previousRaceResultsError);
            dispatch(setError(true));
            return;
        }
        if (previousRaceResultsLoading) {
            console.log('Loading previous first place results...');
            return;
        }
        if (!previousRaceResults) return;

        console.log('previousRaceResults:', previousRaceResults);

        // Group results by year with race winners as parent rows
        const orgedResults = groupWinnersWithChildren(previousRaceResults as unknown as Item[]);
        setRaceResults(orgedResults as unknown as RaceResultProps[]);
        console.log(
            '--------- ?? ordered results:',
            orgedResults,
            previousRaceResults,
            '----------- what am i seeing',
            getPositionOneWithChildren(previousRaceResults),
        );
    }, [previousRaceResults, previousRaceResultsError, previousRaceResultsLoading, dispatch]);

    return (
        <>
            <div className="flex w-fit">
                Total Race Count: {totalRaceCount}
                {/* Pagination components (currently disabled) */}
                {/* <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext onClick={gotoNext} href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination> */}
            </div>
            <Table className="w-full">
                {/* Table header with sortable column headers */}
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                {/* Table body with race results and expandable rows */}
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => {
                            // Determine if this is a child row and find its parent/siblings
                            const isChild = !!row.parentId;
                            const parentRow = isChild
                                ? table.getRowModel().rows.find((r) => r.id === row.parentId)
                                : null;
                            const siblings = isChild && parentRow ? parentRow.subRows : [];
                            const isLastChild = isChild && siblings && siblings[siblings.length - 1]?.id === row.id;

                            return (
                                <Fragment key={`${row.id}-${index}`}>
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
                                    {/* Add separator after expanded rows or last child rows */}
                                    {(row.getIsExpanded() || isLastChild) && (
                                        <tr>
                                            <td
                                                colSpan={row.getAllCells().length}
                                                className="border border-red-500"
                                            ></td>
                                        </tr>
                                    )}
                                    {/* Placeholder for potential future custom row after last child */}
                                    {/* {isLastChild && (
                                    <TableRow>
                                        <TableCell colSpan={row.getAllCells().length}>
                                            <div className="text-center text-xs text-gray-400">End of children</div>
                                        </TableCell>
                                    </TableRow>
                                )} */}
                                </Fragment>
                            );
                        })
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

export default PreviousResultsTable;
