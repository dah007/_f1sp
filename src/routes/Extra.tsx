import DataTable from '@/components/DataTable';
import Flag from '@/components/Flag';
import PageContainer from '@/components/PageContainer';
import { useGetEnginesManufacturersQuery, useGetTyresManufacturersQuery } from '@/features/constructorsApi';
import { ManufacturerProps } from '@/types/constructors';
import { intlNumberFormat } from '@/utils/number';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Extra: React.FC = () => {
    const { data: enginesManufacturerData } = useGetEnginesManufacturersQuery(undefined);
    const { data: tyreManufacturerData } = useGetTyresManufacturersQuery(undefined);

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

    const [enginesManufacturers, setEnginesManufacturer] = useState<ManufacturerProps[]>([]);
    const [tyreManufacturers, setTyreManufacturers] = useState<ManufacturerProps[]>([]);

    const [whatTab, setWhatTab] = useState('enginesManufacturers');

    useEffect(() => {
        if (!enginesManufacturerData) return;
        console.log('Engines Manufacturers:', enginesManufacturers);
        setEnginesManufacturer(enginesManufacturerData);
    }, [enginesManufacturers]);

    useEffect(() => {
        if (!tyreManufacturerData) return;
        console.log('Tyre Manufacturers:', tyreManufacturers);
        setTyreManufacturers(tyreManufacturerData);
    }, [tyreManufacturers]);

    useEffect(() => {
        console.log('Current tab:', whatTab);
    }, [whatTab]);

    const tabs = [
        { value: 'chassis', label: 'Chassis' },
        { value: 'engines', label: 'Engines' },
        {
            value: 'enginesManufacturers',
            label: 'Engine Manufacturers',
            children: <DataTable className="w-fit" columns={manufacturerColDefs} data={enginesManufacturers ?? []} />,
        },
        {
            value: 'tyreManufacturers',
            label: 'Tyre Manufacturers',
            children: <DataTable className="w-fit" columns={manufacturerColDefs} data={tyreManufacturers ?? []} />,
        },
    ];

    return (
        <PageContainer title="Extras" showBreadcrumbs={true} lastCrumb="Extras">
            <Tabs defaultValue="enginesManufacturers" value={whatTab} className="max-w-[85vw] w-[85vw] overflow-hidden">
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Chassis</CardTitle>
                        </CardHeader>

                        <CardContent className="max-w-[96vw]">
                            <div className="w-full h-full flex items-center justify-center">Coming soon</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="engines">
                    <Card>
                        <CardHeader>
                            <CardTitle>Engines</CardTitle>
                        </CardHeader>

                        <CardContent className="max-w-[96vw]">
                            <div className="w-full h-full flex items-center justify-center">Coming soon</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="enginesManufacturers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Engine Manufacturers</CardTitle>
                        </CardHeader>

                        <CardContent className="max-w-[96vw]">
                            <DataTable
                                className="w-0-fit"
                                columns={manufacturerColDefs}
                                data={enginesManufacturers ?? []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="tyreManufacturers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tyre Manufacturers</CardTitle>
                        </CardHeader>

                        <CardContent className="max-w-[96vw]">
                            <DataTable
                                className="w-0-fit"
                                columns={manufacturerColDefs}
                                data={tyreManufacturers ?? []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </PageContainer>
    );
};
export default Extra;
