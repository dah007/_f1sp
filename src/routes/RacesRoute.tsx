import Button from '@/components/Button';
import PageContainer from '@/components/PageContainer';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BUTTON_CLASSES } from '@/constants/constants';
import { ExtendedColumnDef } from '@/types/dataTable';
import { skipToken } from '@reduxjs/toolkit/query';
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
import { RootState, useAppDispatch } from 'app/store';
import TableSortHeader from 'components/TableSortHeader';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from 'components/ui/pagination';
import { useAppSelector } from 'hooks/reduxHooks';
import { Fragment, JSX, startTransition, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { setRaces } from 'slices/racesSlice';
import type { RaceProps } from 'types/races';
import { DistanceCellRenderer, LinkRenderer } from 'utils/dataTableRenderers';
import Flag from '../components/Flag';
import { useGetNextPageQuery, useGetRaceCountQuery, useGetRacesQuery } from '../features/raceApi';

export type OptionProps = {
    label: string;
    value: string;
};

const TOTAL_PER_PAGE = 500;

// Update the type to explicitly include nextLink
export type NextLinkRaceProps = {
    value: RaceProps[];
    nextLink?: string;
    '@odata.nextLink'?: string;
};

const Races: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    const { year } = useParams<{ year: string }>();

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
    } = useGetRacesQuery(parseInt(year as unknown as string, 10)) as {
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
        console.log('RACES:', raceData);
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

        const tPages = Math.ceil((raceTotalCountData as unknown as number) / TOTAL_PER_PAGE);
        setTotalPages(tPages);
    }, [raceTotalCountData]);

    // Track the clicked race ID
    const location = useLocation();
    const [clickedRowId, setClickedRowId] = useState<string | null>(() => {
        // Extract raceId from URL if viewing race detail
        // The route pattern is /races/race/:id based on App.tsx
        const raceDetailMatch = location.pathname.match(/\/races\/race\/([^/]+)/);
        const extractedId = raceDetailMatch ? raceDetailMatch[1] : null;

        // Schedule scroll into view if we have an ID from the URL
        if (extractedId) {
            setTimeout(() => {
                const rowElement = document.querySelector(`tr[data-race-id="${extractedId}"]`);
                if (rowElement) {
                    rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500); // Longer timeout to ensure the table is fully rendered
        }

        return extractedId;
    });

    // Sync clickedRowId with URL changes
    useEffect(() => {
        const raceDetailMatch = location.pathname.match(/\/races\/race\/([^/]+)/);
        const extractedId = raceDetailMatch ? raceDetailMatch[1] : null;
        setClickedRowId(extractedId);
    }, [location.pathname]);

    const navigateRace = useCallback(
        (id: string) => {
            console.log('Navigating to race:', id);
            // Use React's startTransition to handle the potentially suspended state
            // This prevents the UI from showing loading indicators for quick transitions
            // which is what the error message was warning about
            startTransition(() => {
                console.log('Navigating to', id);
                // Update URL without full navigation, preserving the table position
                navigate(`race/${id}`, { replace: true });
                // Set the clicked row ID to position the Outlet
                setClickedRowId(id);

                // Add slight delay to ensure the row is rendered before scrolling
                setTimeout(() => {
                    // Find the row element and scroll it into view
                    const rowElement = document.querySelector(`tr[data-race-id="${id}"]`);
                    if (rowElement) {
                        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            });
        },
        [navigate, setClickedRowId],
    );

    const [colDefs] = useState<ColumnDef<RaceProps, unknown>[]>([
        {
            accessorKey: 'alpha2_code',
            cell: ({ row }) => {
                return (
                    <div className="min-w-8 w-8 max-w-8">{Flag({ cCode: row.getValue('alpha2_code'), size: 24 })}</div>
                );
            },

            header: () => <div className="min-w-4"></div>,
        },
        {
            accessorKey: 'official_name',
            cell: ({ row }) => {
                return LinkRenderer({
                    gotoCB: () => {
                        // console.log('gotoCB', row.original);
                        navigateRace(row.original?.id as unknown as string);
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

    const paginationHeader = useCallback(() => {
        const start = currentPage === 1 ? 1 : currentPage * TOTAL_PER_PAGE;
        const end = currentPage * TOTAL_PER_PAGE;
        if (year) {
            return (
                <a className="text-blue-600 text-left dark:text-blue-400 hover:underline" href="/races">
                    View All Races
                </a>
            );
        }
        return (
            <span>
                {start} - {end} -- ({`Pages: ${currentPage} of ${totalPages}`})
            </span>
        );
    }, [currentPage, totalPages, year]);

    return (
        <PageContainer className="h-full w-full" lastCrumb="Races" title={`Races ${year ? `- ${year}` : ''}`}>
            <ScrollArea className="h-full w-full overflow-hidden">
                <ScrollBar orientation="horizontal" className="w-full" />
                <ScrollBar orientation="vertical" className="w-full" />

                <div className="flex justify-between mb-2">{paginationHeader()}</div>
                <div className="flex p-2">
                    {!year && (
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
                    )}

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
                                <Fragment key={row.id}>
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        data-race-id={row.original.id}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {/* Render Outlet after the clicked row */}
                                    {clickedRowId === String(row.original.id) && (
                                        <TableRow>
                                            <TableCell colSpan={colDefs.length} className="p-0">
                                                <div className="bg-slate-100 dark:bg-zinc-800 p-4 rounded-md shadow-md mt-2 mb-4">
                                                    <Suspense
                                                        fallback={
                                                            <div className="p-4 text-center">
                                                                Loading race details...
                                                            </div>
                                                        }
                                                    >
                                                        <Outlet />
                                                    </Suspense>
                                                    <div className="flex items-center mt-2">
                                                        <Button
                                                            variant="link"
                                                            onClick={() => {
                                                                setClickedRowId(null);
                                                                navigate(`/race/results/${row.original.id}#top`);
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
                                                                navigate(`/races/`);
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
            </ScrollArea>
        </PageContainer>
    );
};

export default Races;
