import { setError, setSelectedYear } from '@/slices/systemWideSlice';
import { LinkRenderer } from '@/utils/dataTableRenderers';
import { Scrollbar } from '@radix-ui/react-scroll-area';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { RootState, useAppDispatch } from 'app/store';
import Button from 'components/Button';
import PageContainer from 'components/PageContainer';
import { Input } from 'components/ui/input';
import { ScrollArea } from 'components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import DropdownYears from 'components/YearsDropdown';
import { BUTTON_CLASSES } from 'constants/constants';
import { useGetDriversQuery } from 'features/driversApi';
import { useAppSelector } from 'hooks/reduxHooks';
import { ArrowUpDown } from 'lucide-react';
import { JSX, Suspense, startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { setDrivers } from 'slices/driversSlice';
import { type ExtendedColumnDef } from 'types/dataTable';
import { type Driver } from 'types/drivers';
import { type AdditionalFiltersYearProps } from 'types/index';
import { intlNumberFormat } from 'utils/number';
import Flag from '../components/Flag';

export type OptionProps = {
    label: string;
    value: string;
};

const Drivers: React.FC = (): JSX.Element => {
    // Ref to store current drivers to avoid dependency cycle
    const driversRef = useRef<Driver[]>([]);

    // Get the current location to extract driverId from URL if present
    const location = useLocation();

    // Track the clicked driver ID
    const [clickedRowId, setClickedRowId] = useState<string | null>(() => {
        // Extract driverId from URL if viewing driver detail
        const driverDetailMatch = location.pathname.match(/\/drivers\/\d+\/driver\/([^/]+)/);
        const extractedId = driverDetailMatch ? driverDetailMatch[1] : null;

        // Schedule scroll into view if we have an ID from the URL
        if (extractedId) {
            setTimeout(() => {
                const rowElement = document.querySelector(`tr[data-driver-id="${extractedId}"]`);
                if (rowElement) {
                    rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500); // Longer timeout to ensure the table is fully rendered
        }

        return extractedId;
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const drivers = useAppSelector((state: RootState) => state.drivers.drivers);

    useEffect(() => {
        driversRef.current = drivers ?? [];
    }, [drivers]);

    let selectedYear = useAppSelector((state: RootState) => state.systemWide.selectedYear);

    const navigateYearCB = (newYear: string) => {
        dispatch(setSelectedYear(Number(newYear)));
        navigate(`/drivers/${newYear}`);
    };
    const navigateDriver = useCallback(
        (driverId: string) => {
            // Use React's startTransition to handle the potentially suspended state
            // This prevents the UI from showing loading indicators for quick transitions
            // which is what the error message was warning about
            startTransition(() => {
                // Update URL without full navigation, preserving the table position
                navigate(`/drivers/${selectedYear}/driver/${driverId}`, { replace: true });
                // Set the clicked row ID to position the Outlet
                setClickedRowId(driverId);

                // Add slight delay to ensure the row is rendered before scrolling
                setTimeout(() => {
                    // Find the row element and scroll it into view
                    const rowElement = document.querySelector(`tr[data-driver-id="${driverId}"]`);
                    if (rowElement) {
                        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            });
        },
        [navigate, selectedYear, setClickedRowId],
    );

    const onFilterTextBoxChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const newYear = Number(event.currentTarget.value);
        dispatch(setSelectedYear(newYear));
        navigateYearCB(newYear.toString());
        selectedYear = newYear;
    };

    const {
        data: driverData,
        isLoading: driverDataIsLoading,
        isError: driverDataIsError,
        error: driverDataError,
    } = useGetDriversQuery(selectedYear) as {
        data: Driver[] | undefined;
        isLoading: boolean;
        isError: boolean;
        error: Error | unknown;
    };

    useEffect(() => {
        if (driverDataIsError) {
            console.error('Error fetching driver data', driverDataError);
            dispatch(setError(true));
            return;
        }
        if (driverDataIsLoading) return;
        if (!driverData) return;
        dispatch(setDrivers(driverData));
    }, [dispatch, driverData, driverDataIsError, driverDataError, driverDataIsLoading]);

    const colDefs = useMemo<ColumnDef<Driver>[]>(
        () => [
            {
                accessorKey: 'nationality_country_id',
                cell: ({ row }) => {
                    return (
                        <div className="min-w-8 w-8 max-w-8">
                            {Flag({ nameAsId: row.getValue('nationality_country_id'), size: 24 })}
                        </div>
                    );
                },
                size: 8,
                maxWidth: 8,
                minWidth: 8,
                header: () => <div></div>,
            },
            {
                accessorKey: 'permanent_number',
                size: 20,
                maxWidth: 20,
                minWidth: 20,
                cell: ({ row }) => <div className="text-right">{row.getValue('permanent_number')}</div>,
                header: () => <div className="text-right">#</div>,
            },
            {
                accessorKey: 'abbreviation',
                cell: ({ row }) => (
                    <div onClick={() => navigateDriver(row.original.id)} className="cursor-pointer hover:text-blue-500">
                        {row.getValue('abbreviation')}
                    </div>
                ),
                header: () => <div className="text-right"></div>,
            },
            {
                accessorKey: 'first_name',

                cell: ({ row }) =>
                    LinkRenderer({
                        gotoCB: navigateDriver,
                        label: row.getValue('first_name'),
                        value: row.original.id,
                    }),
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        First Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'last_name',
                cell: ({ row }) =>
                    LinkRenderer({
                        gotoCB: navigateDriver,
                        label: row.getValue('last_name'),
                        value: row.original.id,
                    }),
                size: 40,
                maxWidth: 40,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Last Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'best_championship_position',
                cell: ({ row }) => <div className="text-right">{row.getValue('best_championship_position')}</div>,
                minWidth: 10,
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
                accessorKey: 'best_race_result',
                cell: ({ row }) => <div className="text-right">{row.getValue('best_race_result')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Driver Result
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_championship_wins',
                cell: ({ row }) => <div className="text-right">{row.getValue('total_championship_wins')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Championships
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_race_wins',
                cell: ({ row }) => <div className="text-right">{row.getValue('total_race_wins')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Wins
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_points',
                cell: ({ row }) => <div className="text-right">{intlNumberFormat(row.getValue('total_points'))}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Points
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_fastest_laps',
                cell: ({ row }) => <div className="text-right">{row.getValue('total_fastest_laps')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Fastest Laps
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
        ],
        [navigateDriver],
    );

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

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 100, //default page is 10
    });

    const table = useReactTable({
        columns: colDefs,
        data: drivers ?? [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
        rowCount: drivers?.length ?? 0,
        initialState: {
            columnVisibility: GetInVisibleColumn(),
        },
    });

    const AdditionalFilters: React.FC<AdditionalFiltersYearProps> = ({
        onFilterTextBoxChanged,
        selectedYear,
    }: AdditionalFiltersYearProps) => (
        <DropdownYears onFilterTextBoxChanged={onFilterTextBoxChanged} selectedYear={Number(selectedYear)} />
    );

    return (
        <PageContainer className="w-[95%] flex flex-col" lastCrumb="Drivers" title="Drivers">
            <div className="flex gap-4 max-w-[75vw]">
                <Input
                    placeholder="Filter..."
                    value={table.getState().globalFilter ?? ''}
                    onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                    className={`${BUTTON_CLASSES} appearance-none`}
                />

                <AdditionalFilters
                    onFilterTextBoxChanged={onFilterTextBoxChanged}
                    selectedYear={selectedYear.toString()}
                />
            </div>

            <ScrollArea className="h-full w-[98vw]">
                <Scrollbar orientation="horizontal" className="w-2" />
                <Scrollbar orientation="vertical" className="w-2" />
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
                                <>
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
                                    {/* Render Outlet after the clicked row */}
                                    {clickedRowId === row.original.id && (
                                        <TableRow>
                                            <TableCell colSpan={colDefs.length} className="p-0">
                                                <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-md shadow-md mt-2 mb-4">
                                                    <Suspense
                                                        fallback={
                                                            <div className="p-4 text-center">
                                                                Loading driver details...
                                                            </div>
                                                        }
                                                    >
                                                        <Outlet />
                                                    </Suspense>
                                                    <div className="flex mt-2">
                                                        <Button
                                                            variant="link"
                                                            onClick={() => {
                                                                setClickedRowId(null);
                                                                navigate(`/drivers/${selectedYear}`);
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
                                </>
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
            </ScrollArea>
        </PageContainer>
    );
};

export default Drivers;
