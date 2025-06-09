import DataTable from '@/components/DataTable';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { setEnginesManufacturers, setTyresManufacturers } from '@/slices/constructorsSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { ColumnDef } from '@tanstack/react-table';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import Button from 'components/Button';
import Flag from 'components/Flag';
import { useGetEnginesManufacturersQuery, useGetTyresManufacturersQuery } from 'features/constructorsApi';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ManufacturerProps } from 'types/constructors';
import { intlNumberFormat } from 'utils/number';
import SeasonsRoute from './SeasonsRoute';
// import type { Engine } from '@/types';
// import { ENGINE_TYPES } from 'constants/constants';

const Extra: React.FC = () => {
    const dispatch = useAppDispatch();

    const [defaultTab, setDefaultTab] = useState('engine');
    const [whatTab, setWhatTab] = useState('engine');

    const { tab } = useParams<{ tab?: string }>();

    useEffect(() => {
        setDefaultTab(tab || 'engine');
        setWhatTab(tab || 'engine');
    }, []);

    // const engines = useAppSelector((state: RootState) => state.constructors.engines);
    const enginesManufacturers = useAppSelector((state: RootState) => state.constructors.enginesManufacturers);
    const tyreManufacturers = useAppSelector((state: RootState) => state.constructors.tyresManufacturers);

    // const enginesColDefs = useMemo<ColumnDef<Engine>[]>(
    //     () => [
    //         {
    //             accessorKey: 'alpha2_code',
    //             cell: ({ row }) => {
    //                 return (
    //                     <div className="min-w-8 w-8 max-w-8">
    //                         {Flag({ cCode: row.getValue('alpha2_code'), size: 24 })}
    //                     </div>
    //                 );
    //             },
    //             size: 8,
    //             maxWidth: 8,
    //             minWidth: 8,
    //             header: () => <div></div>,
    //         },
    //         {
    //             accessorKey: 'full_name',
    //             cell: ({ row }) => <div>{row.getValue('full_name') || '-'}</div>,
    //             header: ({ column }) => {
    //                 return (
    //                     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //                         Name
    //                         <ArrowUpDown className="w-4 h-4 ml-2" />
    //                     </Button>
    //                 );
    //             },
    //         },
    //         {
    //             accessorKey: 'capacity',
    //             cell: ({ row }) => <div>{row.getValue('capacity') || '-'}</div>,
    //             header: ({ column }) => {
    //                 return (
    //                     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //                         Capacity
    //                         <ArrowUpDown className="w-4 h-4 ml-2" />
    //                     </Button>
    //                 );
    //             },
    //         },
    //         {
    //             accessorKey: 'configuration',
    //             cell: ({ row }) => <div>{row.getValue('configuration') || '-'}</div>,
    //             header: ({ column }) => {
    //                 return (
    //                     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //                         Configuration
    //                         <ArrowUpDown className="w-4 h-4 ml-2" />
    //                     </Button>
    //                 );
    //             },
    //         },
    //         {
    //             accessorKey: 'aspiration',
    //             cell: ({ row }) => <div>{ENGINE_TYPES[row.getValue('aspiration') as keyof typeof ENGINE_TYPES]}</div>,
    //             header: ({ column }) => {
    //                 return (
    //                     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //                         Aspiration
    //                         <ArrowUpDown className="w-4 h-4 ml-2" />
    //                     </Button>
    //                 );
    //             },
    //         },
    //     ],
    //     [],
    // );

    const manufacturerColDefs = useMemo<ColumnDef<ManufacturerProps>[]>(
        () => [
            {
                accessorKey: 'alpha2_code',
                cell: ({ row }) => {
                    return (
                        <div className="min-w-8 w-8 max-w-8">
                            {Flag({ cCode: row.getValue('alpha2_code'), size: 24 })}
                        </div>
                    );
                },
                size: 8,
                maxWidth: 8,
                minWidth: 8,
                header: () => <div></div>,
            },
            {
                accessorKey: 'name',
                cell: ({ row }) => <div>{row.getValue('name') || ''}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Name
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'from_year',
                cell: ({ row }) => <div>{row.getValue('from_year') || '-'}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            From
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'to_year',
                cell: ({ row }) => <div>{row.getValue('to_year') || '-'}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            To
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'best_starting_grid_position',
                cell: ({ row }) => <div>{row.getValue('best_starting_grid_position') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Best Start Pos
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'best_race_result',
                cell: ({ row }) => <div>{row.getValue('best_race_result') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Best Race Result
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_championship_wins',
                cell: ({ row }) => <div>{row.getValue('total_championship_wins') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Champ Wins
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_race_entries',
                cell: ({ row }) => <div>{row.getValue('total_race_entries') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Race Entries
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_race_starts',
                cell: ({ row }) => <div>{row.getValue('total_race_starts') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Race Starts
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_race_wins',
                cell: ({ row }) => <div>{row.getValue('total_race_wins') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Wins
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_race_laps',
                cell: ({ row }) => <div>{intlNumberFormat(row.getValue('total_race_laps') || 0)}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Laps
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_podiums',
                cell: ({ row }) => <div>{intlNumberFormat(row.getValue('total_podiums') || 0)}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Podiums
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_podiums_races',
                cell: ({ row }) => <div>{row.getValue('total_podiums_races') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Podium Races
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_points',
                cell: ({ row }) => <div>{row.getValue('total_points') || 0}</div>,
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
                accessorKey: 'total_championship_points',
                cell: ({ row }) => <div>{row.getValue('total_championship_points') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Championship Points
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_pole_positions',
                cell: ({ row }) => <div>{row.getValue('total_pole_positions') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Pole Pos
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_fastest_laps',
                cell: ({ row }) => <div>{row.getValue('total_fastest_laps') || 0}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Fastest Laps
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
        ],
        [],
    );

    const {
        data: enginesManufacturerData,
        isError: enginesManufacturerIsError,
        isLoading: enginesManufacturerIsLoading,
    } = useGetEnginesManufacturersQuery(undefined) as {
        data: ManufacturerProps[];
        isError: boolean;
        isLoading: boolean;
    };

    const {
        data: tyreManufacturerData,
        isError: tyreManufacturerIsError,
        isLoading: tyreManufacturerIsLoading,
    } = useGetTyresManufacturersQuery([]) as {
        data: ManufacturerProps[];
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        if (enginesManufacturerIsError) {
            dispatch(setError(true));
            return;
        }
        if (enginesManufacturerIsLoading) dispatch(setLoading(true));
        if (!enginesManufacturerData) return;
        dispatch(setEnginesManufacturers(enginesManufacturerData));
        dispatch(setLoading(false));
    }, [enginesManufacturerIsError, enginesManufacturerData, enginesManufacturerIsLoading, dispatch]);

    useEffect(() => {
        if (tyreManufacturerIsError) {
            dispatch(setError(true));
            return;
        }
        if (tyreManufacturerIsLoading) dispatch(setLoading(true));
        if (!tyreManufacturerData) return;
        dispatch(setTyresManufacturers(tyreManufacturerData));
        dispatch(setLoading(false));
    }, [tyreManufacturerData]);

    useEffect(() => {}, [whatTab]);

    const tabs = [
        { value: 'season', label: 'Seasons', children: <SeasonsRoute /> },
        ,
        // { value: 'chassis', label: 'Chassis' },
        {
            value: 'engine',
            label: 'Engine Manufacturers',
            children: <DataTable className="w-fit" columns={manufacturerColDefs} data={enginesManufacturers ?? []} />,
        },
        {
            value: 'tyre',
            label: 'Tyre Manufacturers',
            children: <DataTable className="w-fit" columns={manufacturerColDefs} data={tyreManufacturers ?? []} />,
        },
    ];

    return (
        <PageContainer title="Extras" showBreadcrumbs={true} lastCrumb="Extras">
            <Tabs defaultValue={defaultTab} value={whatTab} className="max-w-[85vw] w-[85vw] overflow-hidden pb-10">
                <TabsList className="flexmd:grid w-full md:grid-cols-4">
                    {tabs.map((tab) => {
                        if (!tab) return null;
                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`cursor-pointer ${whatTab === tab.value ? 'bg-zinc-800' : ''}`}
                                onClick={() => setWhatTab(tab.value)}
                            >
                                {tab.label}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {/* <TabsContent value="season">
                    <SeasonsRoute />
                </TabsContent> */}

                <TabsContent value="engine">
                    <DataTable className="w-0-fit" columns={manufacturerColDefs} data={enginesManufacturers ?? []} />
                </TabsContent>

                <TabsContent value="tyre">
                    <DataTable columns={manufacturerColDefs} data={tyreManufacturers ?? []} />
                </TabsContent>
            </Tabs>
        </PageContainer>
    );
};

export default Extra;
