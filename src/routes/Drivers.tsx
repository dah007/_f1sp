import { JSX, useEffect, useCallback, useRef, useMemo } from 'react';
import { RootState, useAppDispatch } from 'app/store';
import { useAppSelector } from 'hooks/reduxHooks';

// import TableSortHeader from 'components/TableSortHeader';
// import { DistanceCellRenderer, LinkRenderer } from 'utils/dataTableRenderers';
import Flag from '../components/Flag';

// import { setSelectedYear } from 'slice/s/siteWideSlice';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { type Driver } from 'types/drivers';
import { setDrivers } from 'slices/driversSlice';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type ExtendedColumnDef } from '@/types/dataTable';
import { Input } from '@/components/ui/input';
import { BUTTON_CLASSES } from '@/constants/constants';
import Button from '@/components/Button';
import { ArrowUpDown } from 'lucide-react';
import { intlNumberFormat } from '@/utils/number';
import { useNavigate } from 'react-router-dom';
import { useGetDriversQuery } from '@/features/driversApi';
import { setError, setSelectedYear } from '@/slices/siteWideSlice';
import { AdditionalFiltersYearProps } from '@/types';
import DropdownYears from '@/components/YearsDropdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scrollbar } from '@radix-ui/react-scroll-area';

export type OptionProps = {
    label: string;
    value: string;
};

const Drivers: React.FC = (): JSX.Element => {
    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    // const [currentNextLink, setCurrentNextLink] = useState<string | null>(null);
    // const [currentPage, setCurrentPage] = useState<number>(0);
    // const [grouping, setGrouping] = useState<GroupingState>([]);
    // const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    // const [nextLinkArray, setNextLinkArray] = useState<string[]>([]);
    // const [sorting, setSorting] = useState<SortingState>([]);
    // const [totalPages, setTotalPages] = useState<number>(0);

    // Ref to store current drivers to avoid dependency cycle
    const driversRef = useRef<Driver[]>([]);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const drivers = useAppSelector((state: RootState) => state.drivers.drivers);
    // let selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);

    // const [, setIsLoaded] = useState(false);

    // Update the ref when drivers change
    useEffect(() => {
        driversRef.current = drivers ?? [];
    }, [drivers]);
    const selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);

    // const navigateYearCB = (newYear: string) => {
    //     setIsLoaded(false);
    //     dispatch(setSelectedYear(Number(newYear)));
    //     navigate(`/drivers/${newYear}`);
    // };

    const navigateDriver = useCallback(
        (driverId: string) => {
            navigate(`/drivers/${selectedYear}/driver/${driverId}`);
        },
        [navigate, selectedYear],
    );

    // const onFilterTextBoxChanged = (event: React.FormEvent<HTMLInputElement>) => {
    //     const newYear = Number(event.currentTarget.value);
    //     dispatch(setSelectedYear(newYear));
    //     navigateYearCB(newYear.toString());
    //     selectedYear = newYear;
    // };

    const {
        data: driverData,
        isLoading: driverDataIsLoading,
        isError: driverDataIsError,
    } = useGetDriversQuery(undefined) as {
        data: Driver[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (driverDataIsLoading) return;
        if (driverDataIsError) {
            dispatch(setError(true));
            console.error('Error fetching driver data');
            return;
        }
        if (!driverData) return;

        console.info('Initial driver data loaded');
        console.log(driverData);

        dispatch(setDrivers(driverData));
    }, [dispatch, driverData, driverDataIsError, driverDataIsLoading]);

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
                cell: ({ row }) => <div className="text-right">{row.getValue('abbreviation')}</div>,
                header: () => <div className="text-right"></div>,
            },
            {
                accessorKey: 'first_name',
                cell: ({ row }) => (
                    <div
                        role="link"
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => navigateDriver(row.original.id)}
                    >
                        {row.getValue('first_name')}
                    </div>
                ),
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        First Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'last_name',
                cell: ({ row }) => (
                    <div
                        role="link"
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => navigateDriver(row.original.id)}
                    >
                        {row.getValue('last_name')}
                    </div>
                ),
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
                header: ({ column }) => {
                    return (
                        <>
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                            <Button
                                variant="ghost"
                                className="flex flex-col"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                <span>Champ Pos</span>
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
    // const [colDefs] = useState<ColumnDef<Driver, unknown>[]>([
    //     {
    //         accessorKey: 'alpha2_code',
    //         cell: ({ row }) => {
    //             return <Flag cCode={row.getValue('alpha2_code')} size={32} />;
    //         },
    //         header: () => <div className="min-w-4"></div>,
    //     },
    //     {
    //         accessorKey: 'official_name',
    //         cell: ({ row }) => {
    //             return LinkRenderer({
    //                 gotoCB: () => {
    //                     // navigateRace(row.original?.race_id as unknown as number);
    //                 },
    //                 label: row.getValue('official_name'),
    //                 value: row.original.id?.toString() ?? '',
    //             });
    //         },
    //         header: ({ column }) => <TableSortHeader<Driver> column={column} name="Name" />,
    //     },
    //     {
    //         accessorKey: 'date',
    //         cell: ({ row }) => row.getValue('date'),
    //         header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Date" />,
    //     },
    //     {
    //         accessorKey: 'race_winner',
    //         cell: ({ row }) => row.getValue('race_winner'),
    //         header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Driver Winner" />,
    //     },
    //     {
    //         accessorKey: 'sprint_winner',
    //         cell: ({ row }) => row.getValue('sprint_winner'),
    //         header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Sprint Winner" />,
    //     },
    //     {
    //         accessorKey: 'country_name',
    //         cell: ({ row }) => row.getValue('country_name'),
    //         header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Location" />,
    //     },
    //     {
    //         accessorKey: 'laps',
    //         cell: ({ row }) => row.getValue('laps'),
    //         header: () => <div className="min-w-4">Laps</div>,
    //     },
    //     {
    //         accessorKey: 'distance',
    //         cell: ({ row }) => DistanceCellRenderer({ value: row.getValue('distance') }),
    //         header: () => <div className="min-w-8">Distance (km)</div>,
    //     },
    //     // {
    //     //     accessorKey: 'time',
    //     //     cell: ({ row }) => row.getValue('time'),
    //     //     header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Lap Time" />,
    //     // },
    // ]);

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
        data: drivers ?? [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // onColumnFiltersChange: setColumnFilters,
        // onSortingChange: setSorting,
        // onGroupingChange: setGrouping,
        // state: {
        //     columnFilters,
        //     grouping,
        //     pagination,
        //     sorting,
        // },
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
    const onFilterTextBoxChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const newYear = Number(event.currentTarget.value);
        dispatch(setSelectedYear(newYear));
    };

    return (
        <ScrollArea className="h-full w-full">
            <Scrollbar orientation="horizontal" className="w-2" />
            <Scrollbar orientation="vertical" className="w-2" />

            <div className="flex p-2">
                <div className="flex items-center gap-4 grow">
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
            </div>

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
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
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
    );
};

export default Drivers;

// import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
// import { RootState, useAppDispatch, useAppSelector } from 'app/store';
// import { ColumnDef } from '@tanstack/react-table';

// import { setDrivers } from '../slices/driversSlice';
// import { useGetDriversQuery } from '../features/driversApi';
// import { useNavigate } from 'react-router-dom';

// import DataTable from 'components/DataTable';
// import DropdownYears from 'components/YearsDropdown';
// import Flag from 'components/Flag';
// import PageContainer from 'components/PageContainer';
// import { AdditionalFiltersYearProps } from 'types/index';
// import { ArrowUpDown } from 'lucide-react';
// import { Button } from 'components/ui/button';
// import { intlNumberFormat } from 'utils/number';
// import { setSelectedYear } from 'slices/siteWideSlice';

// import { type Driver } from 'types/drivers';

/**
 * `Drivers` is a React functional component that displays a list of drivers by year.
 * It fetches driver data based on the selected year and allows navigating to driver details.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * ```tsx
 * <Drivers />
 * ```
 *
 * @remarks
 * This component uses Redux for state management and React Router for navigation.
 * It also utilizes the `useGetDriversQuery` hook to fetch driver data.
 *
 * @hook
 * - `useAppDispatch` to dispatch actions to the Redux store.
 * - `useAppSelector` to select state from the Redux store.
 * - `useNavigate` to navigate between routes.
 * - `useGetDriversQuery` to fetch driver data based on the selected year.
 * - `useEffect` to update the component when driver data changes.
 * - `useState` to manage local state for loading status and column definitions.
 *
 * @returns {JSX.Element} The rendered component.
 */
// const Drivers: React.FC = (): JSX.Element => {
//     const dispatch = useAppDispatch();

//     let selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);

//     const drivers = useAppSelector((state: RootState) => state.drivers.drivers);
//     const [isLoaded, setIsLoaded] = useState(false);

//     const navigate = useNavigate();
//     const navigateYearCB = (newYear: string) => {
//         setIsLoaded(false);
//         dispatch(setSelectedYear(Number(newYear)));
//         navigate(`/drivers/${newYear}`);
//     };
//     const navigateDriver = useCallback(
//         (driverId: string) => {
//             navigate(`/drivers/${selectedYear}/driver/${driverId}`);
//         },
//         [navigate, selectedYear],
//     );

//     const onFilterTextBoxChanged = (event: React.FormEvent<HTMLInputElement>) => {
//         const newYear = Number(event.currentTarget.value);
//         dispatch(setSelectedYear(newYear));
//         navigateYearCB(newYear.toString());
//         selectedYear = newYear;
//     };

//     const { data: driversData } = useGetDriversQuery(selectedYear);

//     useEffect(() => {
//         if (!driversData) return;
//         dispatch(setDrivers(driversData));
//         setIsLoaded(true); // Mark data as loaded
//     }, [driversData, dispatch, isLoaded, drivers]);

//     const colDefs = useMemo<ColumnDef<Driver>[]>(
//         () => [
//             {
//                 accessorKey: 'nationality_country_id',
//                 cell: ({ row }) => {
//                     return (
//                         <div className="min-w-8 w-8 max-w-8">
//                             {Flag({ nameAsId: row.getValue('nationality_country_id'), size: 24 })}
//                         </div>
//                     );
//                 },
//                 size: 8,
//                 maxWidth: 8,
//                 minWidth: 8,
//                 header: () => <div></div>,
//             },
//             {
//                 accessorKey: 'permanent_number',
//                 size: 20,
//                 maxWidth: 20,
//                 minWidth: 20,
//                 cell: ({ row }) => <div className="text-right">{row.getValue('permanent_number')}</div>,
//                 header: () => <div className="text-right">#</div>,
//             },
//             {
//                 accessorKey: 'abbreviation',
//                 cell: ({ row }) => <div className="text-right">{row.getValue('abbreviation')}</div>,
//                 header: () => <div className="text-right"></div>,
//             },
//             {
//                 accessorKey: 'first_name',
//                 cell: ({ row }) => (
//                     <div
//                         role="link"
//                         className="cursor-pointer hover:text-blue-500"
//                         onClick={() => navigateDriver(row.original.id)}
//                     >
//                         {row.getValue('first_name')}
//                     </div>
//                 ),
//                 header: ({ column }) => (
//                     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                         First Name
//                         <ArrowUpDown className="w-4 h-4 ml-2" />
//                     </Button>
//                 ),
//             },
//             {
//                 accessorKey: 'last_name',
//                 cell: ({ row }) => (
//                     <div
//                         role="link"
//                         className="cursor-pointer hover:text-blue-500"
//                         onClick={() => navigateDriver(row.original.id)}
//                     >
//                         {row.getValue('last_name')}
//                     </div>
//                 ),
//                 size: 40,
//                 maxWidth: 40,
//                 header: ({ column }) => (
//                     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                         Last Name
//                         <ArrowUpDown className="w-4 h-4 ml-2" />
//                     </Button>
//                 ),
//             },
//             {
//                 accessorKey: 'best_championship_position',
//                 cell: ({ row }) => <div className="text-right">{row.getValue('best_championship_position')}</div>,
//                 header: ({ column }) => {
//                     return (
//                         <>
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                             <Button
//                                 variant="ghost"
//                                 className="flex flex-col"
//                                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//                             >
//                                 <span>Champ Pos</span>
//                             </Button>
//                         </>
//                     );
//                 },
//             },
//             {
//                 accessorKey: 'best_race_result',
//                 cell: ({ row }) => <div className="text-right">{row.getValue('best_race_result')}</div>,
//                 header: ({ column }) => {
//                     return (
//                         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                             Driver Result
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                         </Button>
//                     );
//                 },
//             },
//             {
//                 accessorKey: 'total_championship_wins',
//                 cell: ({ row }) => <div className="text-right">{row.getValue('total_championship_wins')}</div>,
//                 header: ({ column }) => {
//                     return (
//                         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                             Championships
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                         </Button>
//                     );
//                 },
//             },
//             {
//                 accessorKey: 'total_race_wins',
//                 cell: ({ row }) => <div className="text-right">{row.getValue('total_race_wins')}</div>,
//                 header: ({ column }) => {
//                     return (
//                         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                             Wins
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                         </Button>
//                     );
//                 },
//             },
//             {
//                 accessorKey: 'total_points',
//                 cell: ({ row }) => <div className="text-right">{intlNumberFormat(row.getValue('total_points'))}</div>,
//                 header: ({ column }) => {
//                     return (
//                         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                             Total Points
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                         </Button>
//                     );
//                 },
//             },
//             {
//                 accessorKey: 'total_fastest_laps',
//                 cell: ({ row }) => <div className="text-right">{row.getValue('total_fastest_laps')}</div>,
//                 header: ({ column }) => {
//                     return (
//                         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                             Fastest Laps
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                         </Button>
//                     );
//                 },
//             },
//         ],
//         [navigateDriver],
//     );

//     const AdditionalFilters: React.FC<AdditionalFiltersYearProps> = ({
//         onFilterTextBoxChanged,
//         selectedYear,
//     }: AdditionalFiltersYearProps) => (
//         <DropdownYears onFilterTextBoxChanged={onFilterTextBoxChanged} selectedYear={Number(selectedYear)} />
//     );

//     return (
//         <PageContainer lastCrumb="Drivers" title="Drivers">
//             <DataTable
//                 className="w-fit"
//                 columns={colDefs}
//                 data={drivers ?? []}
//                 additionalFilters={AdditionalFilters({
//                     onFilterTextBoxChanged,
//                     selectedYear: selectedYear.toString(),
//                 })}
//             />
//         </PageContainer>
//     );
// };
//
// export default Drivers;
//
