import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store';

import DataTable from '@/components/DataTable';
import PageContainer from '@/components/PageContainer';

import {
    useGetEnginesManufacturersQuery,
    useGetEnginesQuery,
    useGetTyresManufacturersQuery,
} from '@/features/constructorsApi';

import { setEngines, setEnginesManufacturers, setTyresManufacturers } from '@/slices/constructorsSlice';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { setError, setLoading } from '@/slices/siteWideSlice';

import { Engine } from '@/types';
import Button from '@/components/Button';
import Flag from '@/components/Flag';
// import { ManufacturerProps } from '@/types/constructors';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';
import { intlNumberFormat } from 'utils/number';
import { ManufacturerProps } from '@/types/constructors';

const Extra: React.FC = () => {
    const dispatch = useAppDispatch();
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
        data: enginesData,
        isError: enginesIsError,
        isLoading: enginesIsLoading,
    } = useGetEnginesQuery(undefined) as {
        data: Engine[];
        isError: boolean;
        isLoading: boolean;
    };
    const {
        data: tyreManufacturerData,
        isError: tyreManufacturerIsError,
        isLoading: tyreManufacturerIsLoading,
    } = useGetTyresManufacturersQuery(undefined) as {
        data: ManufacturerProps[];
        isError: boolean;
        isLoading: boolean;
    };

    const engines = useAppSelector((state: RootState) => state.constructors.engines);
    const enginesManufacturers = useAppSelector((state: RootState) => state.constructors.enginesManufacturers);
    const tyreManufacturers = useAppSelector((state: RootState) => state.constructors.tyresManufacturers);

    const [whatTab, setWhatTab] = useState('engines');

    useEffect(() => {
        if (enginesIsError) {
            dispatch(setError(true));
            return;
        }
        if (!enginesData) return;
        if (enginesIsLoading) dispatch(setLoading(true));
        dispatch(setEngines(enginesData));
        dispatch(setLoading(false));
    }, [enginesManufacturerIsError, enginesManufacturerData, enginesManufacturerIsLoading, dispatch]);

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
        { value: 'seasons', label: 'Seasons' },
        { value: 'chassis', label: 'Chassis' },
        {
            value: 'engines',
            label: 'Engines',
            children: <DataTable className="w-fit" columns={engineColDefs} data={engines ?? []} />,
        },
        {
            value: 'enginesManufacturers',
            label: 'Engine Manufacturers',
            children: <DataTable className="w-fit" columns={manufacturerColDefs} data={enginesManufacturers ?? []} />,
        },
        {
            value: 'tyreManufacturers',
            label: 'Tyres',
            children: <DataTable className="w-fit" columns={manufacturerColDefs} data={tyreManufacturers ?? []} />,
        },
    ];

    return (
        <PageContainer title="Extras" showBreadcrumbs={true} lastCrumb="Extras">
            <Tabs
                defaultValue="enginesManufacturers"
                value={whatTab}
                className="max-w-[85vw] w-[85vw] overflow-hidden pb-10"
            >
                <TabsList className="grid w-full grid-cols-4">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className={`cursor-pointer ${whatTab === tab.value ? 'bg-zinc-800' : ''}`}
                            onClick={() => setWhatTab(tab.value)}
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="chassis">
                    <div className="w-full h-full flex items-center justify-center">Coming soon</div>
                </TabsContent>

                <TabsContent value="engines">
                    <DataTable className="w-0-fit" columns={manufacturerColDefs} data={engines ?? []} />
                </TabsContent>

                <TabsContent value="enginesManufacturers">
                    <DataTable className="w-0-fit" columns={manufacturerColDefs} data={enginesManufacturers ?? []} />
                </TabsContent>

                <TabsContent value="tyreManufacturers">
                    <DataTable className="w-0-fit" columns={manufacturerColDefs} data={tyreManufacturers ?? []} />
                </TabsContent>
            </Tabs>
        </PageContainer>
    );
};

export default Extra;
