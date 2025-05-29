import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import Button from '@/components/Button';
import Flag from '@/components/Flag';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { useGetPreviousFirstPlaceResultsQuery, useGetRacesResultsWithQualQuery } from '@/features/raceApi';
import { setError } from '@/slices/siteWideSlice';
import type { GeoJsonData } from '@/types';
import { ExtendedColumnDef } from '@/types/dataTable';
import type { RaceProps, RaceResultProps } from '@/types/races';
import { LinkRenderer } from '@/utils/dataTableRenderers';
import { intlNumberFormat } from '@/utils/number';
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
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

// Remove the async keyword - React components can't be async
const RaceViewRoute = () => {
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext);

    const dispatch = useAppDispatch();

    const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);
    const [race, setRace] = useState<Partial<RaceProps>>();
    const [raceResults, setRaceResults] = useState<RaceResultProps[]>([]);

    let raceId = 0;

    console.log('location.pathname', location.pathname);

    if (location.pathname === '/races/next') {
        raceId = nextRace?.id ? parseInt(nextRace.id, 10) : 0;
        setRace(nextRace as Partial<RaceProps>);
    } else {
        const { id } = useParams<{ id: string }>();
        raceId = id ? parseInt(id, 10) : 0;
    }

    const colDefs = useMemo<ColumnDef<RaceResultProps>[]>(
        () => [
            {
                accessorKey: 'result_time',
                size: 40,
                maxWidth: 40,
                minWidth: 40,
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
                maxWidth: 40,
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
                maxWidth: 8,
                minWidth: 8,
                header: () => <div></div>,
            },
            {
                accessorKey: 'driver',

                cell: ({ row }) =>
                    LinkRenderer({
                        gotoCB: () => `/drivers/${row.driver_id}`,
                        label: row.getValue('driver'),
                        value: row.original.id as unknown as string,
                    }),
                size: 40,
                maxWidth: 40,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'sprint_qualifying_time',
                cell: ({ row }) => {
                    return <div className="min-w-8 w-8 max-w-8">{row.getValue('sprint_qualifying_time')}</div>;
                },
                size: 40,
                maxWidth: 40,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Sprint Quali Time
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
        [],
    );

    // interface GeoJsonData {
    //     type: string;
    //     features: Array<{
    //         type: string;
    //         properties: Record<string, any>;
    //         geometry: {
    //             type: string;
    //             coordinates: Array<number[] | number[][]>;
    //         };
    //     }>;
    // }

    // const getGeoJsonData = async (circuitId: string): Promise<GeoJsonData | null> => {
    //     try {
    //         const response = await fetch(`/assets/tracks/${circuitId}.geojson`);
    //         if (!response.ok) {
    //             console.error(`Error fetching GeoJSON for circuit ${circuitId}:`, response.statusText);
    //             return null;
    //         }
    //         const data: GeoJsonData = await response.json();

    //         return data;
    //     } catch (error) {
    //         console.error(`Error fetching GeoJSON for circuit ${circuitId}:`, error);
    //         return null;
    //     }
    // };

    // When race data is available, load the actual circuit data
    useEffect(() => {
        if (race?.circuit_id) {
            getGeoJsonData(race.circuit_id).then((data) => {
                // console.log(`${race.circuit_id} GeoJSON data:`, data);
                // const coordinates = data?.features[0]?.geometry?.coordinates || [];
                setGeoJsonData(data as unknown as GeoJsonData);
            });
        }
    }, [race?.circuit_id]);

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

    // 1. Declare this variable first, before any hook calls
    const circuitId = race?.circuit_id || '';

    const {
        data: raceResultsData,
        isLoading: raceResultsLoading,
        isError: raceResultsError,
    } = useGetRacesResultsWithQualQuery(raceId);

    // 2. Call this hook immediately after other hooks, before any effects or conditional logic
    const {
        data: previousFirstPlaceResults,
        isLoading: previousFirstPlaceResultsLoading,
        isError: previousFirstPlaceResultsError,
    } = useGetPreviousFirstPlaceResultsQuery(circuitId) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (location.pathname !== '/races/next') {
            console.log('shouldnt be here!!!!!');
            if (raceResultsError) {
                console.error('>>>>> Error fetching race results:', raceResultsError);
                dispatch(setError(true));
                return;
            }
            if (raceResultsLoading) {
                console.log('Loading race results...');
                return;
            }
            if (!raceResultsData) return;

            setRace(raceResultsData[0] as Partial<RaceProps>);
        }
    }, [raceResultsData, raceResultsError, raceResultsLoading, dispatch]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 100, //default page is 10
    });

    const table = useReactTable({
        columns: colDefs,
        data: raceResults || [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
        rowCount: raceResults?.length ?? 0,
        initialState: {
            columnVisibility: GetInVisibleColumn(),
        },
    });

    // The previousFirstPlaceResults hook was moved to the top of the component

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

        console.log('Previous first place results:', previousFirstPlaceResults);

        setRaceResults(previousFirstPlaceResults);
    }, [previousFirstPlaceResults, previousFirstPlaceResultsError, previousFirstPlaceResultsLoading, dispatch]);

    // We can't return early anymore - need to make the UI conditionally render instead
    const hasData = true; // race !== undefined; // && raceResults.length > 0;

    // Only log if we have data
    // if (race?.circuit_id) {
    //     console.log('CIRCUIT_DETAILS', CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS]);
    // }

    // console.log('race', race, 'raceResults', raceResults);

    if (!race || !raceResults) return <></>;

    // Return the UI conditionally
    return (
        <>
            {hasData && (
                <>
                    <div className="flex flex-col justify-between items-center p-4 bg-zinc-800 border-b border-zinc-700">
                        <div className="w-full object-fill relative">
                            <h1 className="text-2xl font-bold krona-one-regular absolute top-4 left-4 ">
                                {race.official_name || race.circuit_id}
                            </h1>
                            <img
                                className="min-w-full max-w-full"
                                src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/geojson(${decodeURI(
                                    JSON.stringify(geoJsonData),
                                )})/${race.longitude},${
                                    race.latitude
                                },12.45,0/1200x200?access_token=pk.eyJ1IjoiZGgwMDciLCJhIjoiY20wdm1weDNyMWhmajJrb2k4MWUwZmUwaiJ9.5Wt08PdFvAjhAcIoeraeEw`}
                                alt={`Next Race, ${race.short_name || race.circuit_id}`}
                            />
                        </div>

                        <div className="flex justify-evenly items-center gap-4 w-full p-4">
                            <div>
                                <div className="text-xl font-bold r-2 krona-one-regular">When?</div>
                                <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                                    {race.date} @ {race.time || 'TBD'} local time
                                </div>

                                <div className="text-xl font-bold r-2 krona-one-regular">Where?</div>
                                <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                                    {race.race_country ?? 'N/A'}
                                </div>

                                <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                                <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                                    {race.round || 'TBD'} of {race.total_rounds || 'TBD'}
                                </div>

                                <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                                <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                                    {race.course_length ? `${race.course_length} m` : 'TBD'}
                                </div>

                                <div className="text-xl font-bold r-2 krona-one-regular">More Info</div>
                                {race?.circuit_id &&
                                    CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                                        <a
                                            className="text-blue-500 hover:underline"
                                            href={
                                                CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ??
                                                ''
                                            }
                                            referrerPolicy="no-referrer"
                                            target="_blank"
                                        >
                                            WiKi
                                        </a>
                                    )}
                            </div>

                            <div>
                                <img
                                    className="max-w-[300px]"
                                    alt={race.official_name || race.circuit_id}
                                    src={`/assets/tracks/${race.circuit_id}.png`}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                <h2 className="text-xl font-bold mb-2 krona-one-regular">Results</h2>
                coming soon...
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
            </div>

            {!hasData && raceResultsLoading && <div>Loading race data...</div>}
            {!hasData && !raceResultsLoading && <div>No race data available.</div>}
        </>
    );
};
export default RaceViewRoute;

// import { Outlet, Route, Routes } from 'react-router-dom';

/**
 


            <PageContainer
                className="h-full w-full flex"
                lastCrumb={race.gp_short_name?.toString() ?? 'Next'}
                title={`${race.official_name || race.circuit_id}`}
            >
                {!raceResultsLoading && (
                    <div className="w-full object-fill relative">
                        <img
                            className="min-w-full max-w-full"
                            src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${race.longitude},${race.latitude},12.45,0/1200x200?access_token=pk.eyJ1IjoiZGgwMDciLCJhIjoiY20wdm1weDNyMWhmajJrb2k4MWUwZmUwaiJ9.5Wt08PdFvAjhAcIoeraeEw`}
                            alt={`Next Race, ${race.short_name || race.circuit_id}`}
                        />

                        <div
                            className={`absolute z-20 p-2 rounded-md bg-opacity-40 lg:top-2 right-12 bg-zinc-800 border border-zinc-700 h-fit`}
                        >
                            {race.longitude}, {race.latitude}
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-start gap-4 w-full p-4">
                    <div>
                        <div className="text-xl font-bold r-2 krona-one-regular">When?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {race.date} @ {race.time || 'TBD'} local time
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Where?</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {race.official_name || race.circuit_id}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {race.round || 'TBD'} of {race.total_rounds || 'TBD'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {race.course_length ? `${race.course_length} m` : 'TBD'}
                        </div>
                    </div>

                    <div>
                        <img
                            className="max-w-[300px]"
                            alt={race.official_name || race.circuit_id}
                            src={`/assets/tracks/${race.circuit_id}.png`}
                        />
                    </div>
                </div>

                <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                    <h2 className="text-xl font-bold mb-2 krona-one-regular">Previous Results</h2>
                </div>

                <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                    <h2 className="text-xl font-bold mb-2 krona-one-regular">Results</h2>

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
                </div>
            </PageContainer>

 */
