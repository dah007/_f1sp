import { useAppDispatch } from '@/app/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetLastResultsAtCircuitQuery } from '@/features/raceApi';
import { setError } from '@/slices/systemWideSlice';
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
import { ArrowUpDown, ChartSpline, FlagIcon, Medal } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../Button';
import Flag from '../Flag';

/**
 * LastResultsTable component displays the last race results for a specific circuit.
 * @deprecated
 */
const LastResultsTable: React.FC<{ circuitId: string }> = ({
    circuitId,
    // setRaceResults,
}): JSX.Element => {
    const dispatch = useAppDispatch();

    const [raceResults, setRaceResults] = useState<RaceResultProps[]>([]);

    const colDefs = (): ColumnDef<RaceResultProps>[] => [
        {
            accessorKey: 'position_number',
            cell: ({ row }) => {
                return <div className="min-w-8 max-w-8 w-full text-center">{row.getValue('position_number')}</div>;
            },
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="cursor-pointer min-w-8 max-w-8 w-8"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    title="Finish Position"
                >
                    <FlagIcon size={24} />
                    <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
            ),
        },
        {
            accessorKey: 'countryId',
            cell: ({ row }) => {
                return (
                    <div className="min-w-8 w-8 max-w-8">
                        <Flag nameAsId={row.getValue('countryId')} size={24} />
                    </div>
                );
            },
            size: 8,
            header: () => <div></div>,
        },
        {
            accessorKey: 'driver_name',

            cell: ({ row }) => (
                <div className="min-w-12 w-12 max-w-12">
                    {LinkRenderer({
                        gotoCB: () => `/drivers/${row.getValue('driver_id')}`,
                        label: row.getValue('driver_name'),
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
        // {
        //     accessorKey: 'date',
        //     cell: ({ row }) => <div className="text-right">{row.getValue('date')}</div>,
        //     header: ({ column }) => {
        //         return (
        //             <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        //                 Date
        //                 <ArrowUpDown className="w-4 h-4 ml-2" />
        //             </Button>
        //         );
        //     },
        // },
        {
            accessorKey: 'time',
            size: 15,
            cell: ({ row }) => <div className="text-right w-full">{row.getValue('time')}</div>,
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
        // {
        //     accessorKey: 'year',
        //     cell: ({ row }) => (
        //         <div
        //             // onClick={() => (location.href = `/drivers/${row.original.id}`)}
        //             className="cursor-pointer hover:text-blue-500"
        //         >
        //             {row.getValue('year')}
        //         </div>
        //     ),
        //     size: 40,
        //     header: ({ column }) => (
        //         <Button
        //             variant="ghost"
        //             className="cursor-pointer"
        //             onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        //         >
        //             Year
        //             <ArrowUpDown className="w-4 h-4 ml-2" />
        //         </Button>
        //     ),
        // },

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

    const {
        data: previousFirstPlaceResults,
        isLoading: previousFirstPlaceResultsLoading,
        isError: previousFirstPlaceResultsError,
    } = useGetLastResultsAtCircuitQuery({ circuitId }) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    console.log('RACE RESULTS', raceResults);

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

        console.log('previousFirstPlaceResults:', previousFirstPlaceResults);

        setRaceResults(previousFirstPlaceResults);
        console.log('Previous first place results fetched successfully:', previousFirstPlaceResults);
    }, [previousFirstPlaceResults, previousFirstPlaceResultsError, previousFirstPlaceResultsLoading, dispatch]);

    return (
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
    );
};
export default LastResultsTable;

// import { ExtendedColumnDef } from '@/types/dataTable';
// import type { RaceResultProps } from '@/types/races';
// import { LinkRenderer } from '@/utils/dataTableRenderers';
// import { GetInVisibleColumn, pagination } from '@/utils/tables';
// import {
//     ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from '@tanstack/react-table';
// import { ArrowUpDown } from 'lucide-react';
// import Flag from '../Flag';
// import { Button } from '../ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

// const LastResultsTable: React.FC<{ lastRace: RaceResultProps[] }> = ({ lastRace }): JSX.Element => {
//     const colDefs = (): ColumnDef<RaceResultProps>[] => [
//         {
//             accessorKey: 'countryId',
//             cell: ({ row }) => {
//                 return (
//                     <div className="min-w-8 w-8 max-w-8">{Flag({ nameAsId: row.getValue('countryId'), size: 24 })}</div>
//                 );
//             },
//             size: 8,
//             header: () => <div></div>,
//         },
//         {
//             accessorKey: 'driver_name',
//             cell: ({ row }) =>
//                 LinkRenderer({
//                     gotoCB: () => `/drivers/${row.getValue('driver_id')}`,
//                     label: row.getValue('driver_name'),
//                     value: row.original.id as unknown as string,
//                 }),
//             size: 40,
//             header: ({ column }) => (
//                 <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                     Name
//                     <ArrowUpDown className="w-4 h-4 ml-2" />
//                 </Button>
//             ),
//         },
//         {
//             accessorKey: 'grid_position_number',
//             cell: ({ row }) => <div className="w-6">{row.getValue('grid_position_number')}</div>,
//             header: ({ column }) => {
//                 return (
//                     <>
//                         <Button
//                             variant="ghost"
//                             className="flex"
//                             onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//                         >
//                             Start Position
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                         </Button>
//                     </>
//                 );
//             },
//             maxSize: 40,
//         },
//         {
//             accessorKey: 'position_number',
//             cell: ({ row }) => <div className="w-6">{row.getValue('position_number')}</div>,
//             header: ({ column }) => {
//                 return (
//                     <>
//                         <Button
//                             variant="ghost"
//                             className="flex"
//                             onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//                         >
//                             Finish Position
//                             <ArrowUpDown className="w-4 h-4 ml-2" />
//                         </Button>
//                     </>
//                 );
//             },
//         },
//         {
//             accessorKey: 'time',
//             size: 40,
//             cell: ({ row }) => <div className="text-right">{row.getValue('time')}</div>,
//             header: ({ column }) => (
//                 <Button
//                     variant="ghost"
//                     className="cursor-pointer"
//                     onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//                 >
//                     Time
//                     <ArrowUpDown className="w-4 h-4 ml-2" />
//                 </Button>
//             ),
//         },
//         {
//             accessorKey: 'interval',
//             size: 40,
//             cell: ({ row }) => <div>{row.getValue('interval') ?? '-'}</div>,
//             header: ({ column }) => (
//                 <Button
//                     variant="ghost"
//                     className="cursor-pointer"
//                     onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//                 >
//                     Time
//                     <ArrowUpDown className="w-4 h-4 ml-2" />
//                 </Button>
//             ),
//         },
//         {
//             accessorKey: 'gap',
//             size: 40,
//             cell: ({ row }) => <div>{row.getValue('gap') !== null ? row.getValue('gap') : '-'}</div>,
//             header: ({ column }) => (
//                 <Button
//                     variant="ghost"
//                     className="cursor-pointer"
//                     onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//                 >
//                     Gap
//                     <ArrowUpDown className="w-4 h-4 ml-2" />
//                 </Button>
//             ),
//         },
//         {
//             accessorKey: 'laps',
//             cell: ({ row }) => {
//                 return <div className="min-w-8 w-8 max-w-8">{row.getValue('laps')}</div>;
//             },
//             size: 40,
//             header: ({ column }) => (
//                 <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                     Laps
//                     <ArrowUpDown className="w-4 h-4 ml-2" />
//                 </Button>
//             ),
//         },
//         {
//             accessorKey: 'points',
//             cell: ({ row }) => <div className="text-right">{row.getValue('points') ?? '-'}</div>,
//             header: ({ column }) => {
//                 return (
//                     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                         Points
//                         <ArrowUpDown className="w-4 h-4 ml-2" />
//                     </Button>
//                 );
//             },
//         },
//     ];

//     const table = useReactTable({
//         columns: colDefs(),
//         data: lastRace || [],
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         state: {
//             pagination: pagination,
//         },
//         rowCount: lastRace?.length ? Number(lastRace?.length) : 0,
//         initialState: {
//             columnVisibility: GetInVisibleColumn(colDefs() as unknown as ExtendedColumnDef[]),
//         },
//     });

//     return (
//         <Table className="w-full">
//             <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                     <TableRow key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => {
//                             return (
//                                 <TableHead key={header.id}>
//                                     {header.isPlaceholder
//                                         ? null
//                                         : flexRender(header.column.columnDef.header, header.getContext())}
//                                 </TableHead>
//                             );
//                         })}
//                     </TableRow>
//                 ))}
//             </TableHeader>
//             <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                     table.getRowModel().rows.map((row) => (
//                         <TableRow
//                             key={row.id}
//                             data-state={row.getIsSelected() && 'selected'}
//                             data-driver-id={row.original.id}
//                         >
//                             {row.getVisibleCells().map((cell) => (
//                                 <TableCell key={cell.id}>
//                                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     ))
//                 ) : (
//                     <TableRow key="no-results">
//                         <TableCell colSpan={colDefs.length} className="h-24 text-center" key="nope-none">
//                             No results.
//                         </TableCell>
//                     </TableRow>
//                 )}
//             </TableBody>
//         </Table>
//     );
// };
// export default LastResultsTable;
