import { JSX, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { RootState, useAppDispatch } from 'app/store';
import { useAppSelector } from 'hooks/reduxHooks';
import { skipToken } from '@reduxjs/toolkit/query';

import { useGetNextPageQuery, useGetRaceCountQuery, useGetRacesQuery } from '../features/raceApi';

// import DataTable from 'components/DataTable';
import TableSortHeader from 'components/TableSortHeader';
import { DistanceCellRenderer, LinkRenderer } from 'utils/dataTableRenderers';
import Flag from '../components/Flag';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    GroupingState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { type RaceProps } from 'types/races';
import { setRaces } from 'slices/racesSlice';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from 'components/ui/pagination';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExtendedColumnDef } from '@/types/dataTable';
import { Input } from '@/components/ui/input';
import { BUTTON_CLASSES } from '@/constants/constants';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export type OptionProps = {
    label: string;
    value: string;
};

// Update the type to explicitly include nextLink
export type NextLinkRaceProps = {
    value: RaceProps[];
    nextLink?: string;
    '@odata.nextLink'?: string;
};

const Races: React.FC = (): JSX.Element => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [currentNextLink, setCurrentNextLink] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [grouping, setGrouping] = useState<GroupingState>([]);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [nextLinkArray, setNextLinkArray] = useState<string[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [totalPages, setTotalPages] = useState<number>(0);

    // Ref to store current races to avoid dependency cycle
    const racesRef = useRef<RaceProps[]>([]);

    const dispatch = useAppDispatch();
    const races = useAppSelector((state: RootState) => state.races.races);

    // Update the ref when races change
    useEffect(() => {
        racesRef.current = races;
    }, [races]);

    const { data: raceTotalCountData } = useGetRaceCountQuery(undefined);

    const {
        data: raceData,
        isLoading: raceDataIsLoading,
        isError: raceDataIsError,
    } = useGetRacesQuery(undefined) as {
        data: NextLinkRaceProps | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    // Use skip pattern with skipToken to properly manage the query execution
    // Remove isLoadingMore from the skip condition to ensure query runs when we set currentNextLink
    const {
        data: nextPageData,
        isLoading: nextPageLoading,
        isSuccess: nextPageSuccess,
        isError: nextPageError,
    } = useGetNextPageQuery(currentNextLink ?? skipToken, {
        skip: !currentNextLink,
    }) as {
        data: NextLinkRaceProps | undefined;
        isLoading: boolean;
        isSuccess: boolean;
        isError: boolean;
    };

    // Memoized function to go to next page with useCallback to prevent recreation on render
    const gotoNext = useCallback(() => {
        if (nextLinkArray.length > 0 && !isLoadingMore && !nextPageLoading) {
            setIsLoadingMore(true);

            // Always use the first item in the array (index 0)
            setCurrentNextLink(nextLinkArray[0]);
        }
    }, [nextLinkArray, isLoadingMore, nextPageLoading]);

    // Handle initial races data
    useEffect(() => {
        if (raceDataIsLoading) return;
        if (raceDataIsError) {
            console.error('Error fetching race data');
            return;
        }
        if (!raceData?.value) return;

        setCurrentPage(1);

        // Check for OData nextLink format first, then fallback to standard nextLink
        const responseNextLink = raceData['@odata.nextLink'] || raceData.nextLink;
        if (responseNextLink) {
            // Extract the query part from the URL
            const queryPart = responseNextLink.split('?')[1];
            if (queryPart) {
                setNextLinkArray([queryPart]);
            }
        }
        dispatch(setRaces(raceData.value));
    }, [dispatch, raceData, raceDataIsError, raceDataIsLoading]);

    // Monitor API loading status
    useEffect(() => {
        if (nextPageLoading) {
            console.info('Next page data loading...');
        }
    }, [nextPageLoading]);

    // Process next page results when they arrive - removed races from dependencies
    useEffect(() => {
        if (!nextPageSuccess || !nextPageData?.value) return;

        // Get races from ref to avoid dependency cycle
        const currentRaces = racesRef.current;

        // Use a functional update to ensure we're working with the latest state
        dispatch(setRaces([...currentRaces, ...nextPageData.value]));

        // Check if there's another nextLink in the response
        const responseNextLink = nextPageData['@odata.nextLink'] || nextPageData.nextLink;

        // Update nextLinkArray based on the new response
        setNextLinkArray((prev) => {
            // Create a new array to avoid mutation
            const newArray = [...prev];

            // If we have a new link, replace the first item that we just used
            if (responseNextLink) {
                const newNextLink = responseNextLink.split('?')[1];
                if (newNextLink) {
                    // If we have remaining links, replace the first one
                    // Otherwise add it as a new item
                    if (newArray.length > 0) {
                        newArray[0] = newNextLink;
                    } else {
                        newArray.push(newNextLink);
                    }
                } else {
                    // If no query part found, remove the used link
                    return newArray.slice(1);
                }
            } else {
                // No more pages, remove the used link
                return newArray.slice(1);
            }

            return newArray;
        });

        // Update current page
        setCurrentPage((prev) => prev + 1);

        // Reset loading states
        setIsLoadingMore(false);
        setCurrentNextLink(null);

        dispatch(setRaces(nextPageData.value));
    }, [nextPageData, nextPageSuccess, dispatch]);

    // Handle any errors in pagination
    useEffect(() => {
        if (nextPageError) {
            console.error('Error loading next page');
            setIsLoadingMore(false);
            setCurrentNextLink(null);
        }
    }, [nextPageError]);

    // Update total pages from race count
    useEffect(() => {
        if (!raceTotalCountData) return;

        const tPages = Math.ceil((raceTotalCountData as unknown as number) / 100);
        setTotalPages(tPages);
    }, [raceTotalCountData]);

    const [colDefs] = useState<ColumnDef<RaceProps, unknown>[]>([
        {
            accessorKey: 'alpha2_code',
            cell: ({ row }) => {
                return <Flag cCode={row.getValue('alpha2_code')} size={32} />;
            },
            header: () => <div className="min-w-4"></div>,
        },
        {
            accessorKey: 'official_name',
            cell: ({ row }) => {
                return LinkRenderer({
                    gotoCB: () => {
                        // navigateRace(row.original?.race_id as unknown as number);
                    },
                    label: row.getValue('official_name'),
                    value: row.original.race_id?.toString() ?? '',
                });
            },
            header: ({ column }) => <TableSortHeader<RaceProps> column={column} name="Name" />,
        },
        {
            accessorKey: 'date',
            cell: ({ row }) => row.getValue('date'),
            header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Date" />,
        },
        {
            accessorKey: 'race_winner',
            cell: ({ row }) => row.getValue('race_winner'),
            header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Race Winner" />,
        },
        {
            accessorKey: 'sprint_winner',
            cell: ({ row }) => row.getValue('sprint_winner'),
            header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Sprint Winner" />,
        },
        {
            accessorKey: 'country_name',
            cell: ({ row }) => row.getValue('country_name'),
            header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Location" />,
        },
        {
            accessorKey: 'laps',
            cell: ({ row }) => row.getValue('laps'),
            header: () => <div className="min-w-4">Laps</div>,
        },
        {
            accessorKey: 'distance',
            cell: ({ row }) => DistanceCellRenderer({ value: row.getValue('distance') }),
            header: () => <div className="min-w-8">Distance (km)</div>,
        },
        // {
        //     accessorKey: 'time',
        //     cell: ({ row }) => row.getValue('time'),
        //     header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Lap Time" />,
        // },
    ]);

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

    const pagination = useMemo(() => {
        return {
            pageIndex: 0,
            pageSize: races.map((d) => `${d.subRows}`?.length ?? 0).reduce((acc, val) => acc + val, 0) + races.length,
        };
    }, [races]);

    const table = useReactTable({
        columns: colDefs,
        data: races,
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

    return (
        <ScrollArea className="h-full w-full overflow-hidden">
            <ScrollBar orientation="horizontal" className="w-full" />
            <ScrollBar orientation="vertical" className="w-full" />

            <div className="flex justify-between mb-2">
                <h2>
                    Total Races: {races.length} / Pages: {currentPage} of {totalPages}
                </h2>
            </div>
            <div className="flex p-2">
                <div className="flex w-fit">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>

                            {/* {AddPaginationItems(1, totalPages)} */}

                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext onClick={gotoNext} href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                <div className="flex items-center gap-4 grow">
                    <Input
                        placeholder="Filter..."
                        value={table.getState().globalFilter ?? ''}
                        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                        className={`${BUTTON_CLASSES} appearance-none`}
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

export default Races;
