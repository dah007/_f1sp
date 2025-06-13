import { Fragment, startTransition, Suspense, useCallback, useEffect, useState } from 'react';

import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { setError, setLoading } from '@/slices/systemWideSlice';
import { useGetSeasonStatsQuery } from 'features/seasonsApi';

import Button from '@/components/Button';
import Flag from '@/components/Flag';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BUTTON_CLASSES } from '@/constants/constants';
import { setSeasons } from '@/slices/seasonsSlice';
import { ExtendedColumnDef } from '@/types/dataTable';
import { LinkRenderer } from '@/utils/dataTableRenderers';
import { rightAligned } from '@/utils/tables';
import {
    ColumnDef,
    ColumnFiltersState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    GroupingState,
    PaginationState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import type { Season } from 'types/season';

const Seasons: React.FC = (): JSX.Element => {
    const { year } = useParams<{ year: string }>();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const columnHelper = createColumnHelper<Season>();

    const selectedYear = useAppSelector((state: RootState) => state.systemWide.selectedYear);
    const seasons = useAppSelector((state: RootState) => state.seasons.seasons);

    const [clickedRowId, setClickedRowId] = useState<string | null>(null);
    const [colDefs] = useState<ColumnDef<Season, unknown>[]>([
        {
            accessorKey: 'year',
            cell: ({ row }) => {
                return LinkRenderer({
                    gotoCB: () => navigateSeason(row.original.year?.toString()),
                    label: row.getValue('year'),
                    value: row.original.year?.toString(),
                });
            },
            header: () => <div className="min-w-">Year</div>,
        },
        {
            accessorKey: 'driverChampion',
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Flag nameAsId={row.original.driverNationality} size={32} />
                        {row.getValue('driverChampion')}
                    </div>
                );
            },
            header: () => <div className="min-w-8">Champion</div>,
        },
        {
            accessorKey: 'driverChampionPoints',
            cell: ({ row }) => row.getValue('driverChampionPoints'),
            header: () => <div className="min-w-8">Points</div>,
        },
        {
            accessorKey: 'constructorChampion',
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Flag nameAsId={row.original.constructorCountry} size={32} />
                        {LinkRenderer({
                            gotoCB: () => navigate(`/constructors/${row.original.constructorId}`),
                            label: row.getValue('constructorChampion'),
                            value: row.original.driverChampionId,
                        })}
                    </div>
                );
            },
            header: () => <div className="min-w-10">Constructor</div>,
        },
        {
            accessorKey: 'constructorPoints',
            cell: ({ row }) => rightAligned(row.getValue('constructorPoints')),
            header: () => <div className="min-w-8">Points</div>,
        },
        {
            accessorKey: 'constructorEngine',
            cell: ({ row }) => row.getValue('constructorEngine'),
            header: () => <div className="min-w-8">Engine</div>,
        },
        {
            id: 'totals',
            header: () => <div className="p-2 border-l">Totals:</div>,
            columns: [
                columnHelper.accessor('driverCount', {
                    cell: (info: { getValue: () => string | number }) => (
                        <div className="border-l p-2 pt-0 pb-0">{rightAligned(info.getValue())}</div>
                    ),
                    header: () => <div className="border-l p-2">Drivers</div>,
                }),
                columnHelper.accessor('constructorCount', {
                    cell: (info: { getValue: () => string | number }) => rightAligned(info.getValue()),
                    header: () => <span>Constructors</span>,
                }),
                columnHelper.accessor('raceCount', {
                    cell: (info) => rightAligned(info.getValue()),
                    header: () => <span>Races</span>,
                }),
                columnHelper.accessor('totalLaps', {
                    cell: (info) => rightAligned(info.getValue()),
                    header: () => <span>Laps</span>,
                }),
            ],
        },
    ]);
    const [grouping, setGrouping] = useState<GroupingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const GetInVisibleColumn = (): Record<string, boolean> => {
        const inVisibleColumns: ExtendedColumnDef[] = colDefs.filter(
            (col) => 'visible' in col && col.visible === false,
        ) as unknown as ExtendedColumnDef[];

        const removedColumn = {} as Record<string, boolean>;

        for (const item of inVisibleColumns) {
            removedColumn[item.accessorKey as string] = false;
        }
        return removedColumn;
    };

    const table = useReactTable({
        columns: colDefs,
        data: seasons,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        state: {
            columnFilters,
            grouping,
            pagination,
            sorting,
        },
        initialState: {
            columnVisibility: GetInVisibleColumn(),
        },
    });

    const navigateSeason = useCallback(
        (year: string) => {
            startTransition(() => {
                // Update URL without full navigation, preserving the table position
                navigate(`season/${year}`, { replace: true });
                // Set the clicked row ID to position the Outlet
                setClickedRowId(year);

                // Add slight delay to ensure the row is rendered before scrolling
                setTimeout(() => {
                    // Find the row element and scroll it into view
                    const rowElement = document.querySelector(`tr[data-season-id="${year}"]`);
                    if (rowElement) {
                        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            });
        },
        [navigate, setClickedRowId],
    );

    useEffect(() => {
        if (year) {
            // If a year is provided in the URL, navigate to that season
            navigateSeason(year);
        }
    }, [year, navigateSeason]);

    const {
        data: seasonsData,
        isError,
        isLoading,
    } = useGetSeasonStatsQuery(selectedYear) as {
        data: Season[] | undefined;
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        if (isError) {
            dispatch(setError(true));
            return;
        }
        if (isLoading) {
            dispatch(setError(false));
            dispatch(setLoading(true));
            return;
        }
        if (!seasonsData) return;
        dispatch(setLoading(false));
        dispatch(setSeasons(seasonsData));
    }, [dispatch, isError, isLoading, seasonsData]);

    return (
        <>
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Filter..."
                    value={table.getState().globalFilter ?? ''}
                    onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                    className={`${BUTTON_CLASSES} max-w-[40%]`}
                />
            </div>

            <Table className="w-full">
                <TableHeader className="sticky top-0 z-10 bg-background">
                    {table.getHeaderGroups().map((headerGroup, groupIndex) => (
                        <TableRow key={`${headerGroup.id}-${groupIndex}`}>
                            {headerGroup.headers.map((header, headerIndex) => {
                                return (
                                    <TableHead key={`${header.id}-${headerIndex}-${groupIndex}`}>
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
                            <Fragment key={row.id}>
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    data-race-id={row.original.year}
                                >
                                    {row.getVisibleCells().map((cell, cellIndex) => (
                                        <TableCell key={`${cell.id}--${cellIndex}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {/* Render Outlet after the clicked row */}
                                {clickedRowId === String(row.original.year) && (
                                    <TableRow>
                                        <TableCell colSpan={colDefs.length + 3} className="p-0">
                                            <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-md shadow-md mt-2 mb-4">
                                                <Suspense
                                                    fallback={
                                                        <div className="p-4 text-center">Loading season details...</div>
                                                    }
                                                >
                                                    <Outlet />
                                                </Suspense>
                                                <div className="flex items-center mt-2">
                                                    <Button
                                                        variant="link"
                                                        onClick={() => {
                                                            setClickedRowId(null);
                                                            navigate(`/race/results/${row.original.year}#top`);
                                                        }}
                                                        className="px-2 py-1 text-sm text-blue-700 dark:text-blue-300 hover:text-blue-500 cursor-pointer"
                                                    >
                                                        View Results
                                                    </Button>
                                                    {' | '}
                                                    <Button
                                                        variant="link"
                                                        onClick={() => {
                                                            setClickedRowId(null);
                                                            navigate(`/seasons`);
                                                        }}
                                                        className="px-2 py-1 text-sm text-blue-700 dark:text-blue-300 hover:text-blue-500 cursor-pointer"
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={colDefs.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
    // <DataTable data={seasons} columns={colDefs} />;
};

export default Seasons;
