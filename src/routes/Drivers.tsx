import { JSX, useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { RootState, useAppDispatch } from 'app/store';
import { useAppSelector } from 'hooks/reduxHooks';
import { Outlet, useNavigate } from 'react-router-dom';

import Button from '@/components/Button';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import DropdownYears from '@/components/YearsDropdown';
import Flag from '../components/Flag';
import PageContainer from '@/components/PageContainer';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scrollbar } from '@radix-ui/react-scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { setDrivers } from 'slices/driversSlice';

import { BUTTON_CLASSES } from '@/constants/constants';
import { ArrowUpDown } from 'lucide-react';

import { useGetDriversQuery } from '@/features/driversApi';
import { setError, setSelectedYear } from '@/slices/siteWideSlice';

import { intlNumberFormat } from '@/utils/number';

import { type AdditionalFiltersYearProps } from '@/types';
import { type Driver } from 'types/drivers';
import { type ExtendedColumnDef } from '@/types/dataTable';

export type OptionProps = {
    label: string;
    value: string;
};

const Drivers: React.FC = (): JSX.Element => {
    // Ref to store current drivers to avoid dependency cycle
    const driversRef = useRef<Driver[]>([]);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const drivers = useAppSelector((state: RootState) => state.drivers.drivers);

    useEffect(() => {
        driversRef.current = drivers ?? [];
    }, [drivers]);

    let selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);

    const navigateYearCB = (newYear: string) => {
        dispatch(setSelectedYear(Number(newYear)));
        navigate(`/drivers/${newYear}`);
    };

    const navigateDriver = useCallback(
        (driverId: string) => {
            navigate(`/drivers/${selectedYear}/driver/${driverId}`);
        },
        [navigate, selectedYear],
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
    } = useGetDriversQuery(selectedYear) as {
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
                cell: ({ row }) => <div>{row.getValue('abbreviation')}</div>,
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

            {/* detail page shows here... */}
            <Outlet />

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
        </PageContainer>
    );
};

export default Drivers;
