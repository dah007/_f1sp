import DataTable from '@/components/DataTable';
import Flag from '@/components/Flag';
import PageContainer from '@/components/PageContainer';
import { useGetEnginesManufacturersQuery } from '@/features/constructorsApi';
import { EngineManufacturerProps } from '@/types/constructors';
import { intlNumberFormat } from '@/utils/number';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Extra: React.FC = () => {
    const { data: enginesManufacturers } = useGetEnginesManufacturersQuery(undefined);

    const enginesManufacturerColDefs = useMemo<ColumnDef<EngineManufacturerProps>[]>(
        () => [
            {
                accessorKey: 'year',
                cell: ({ row }) => {
                    return <div className="min-w-8 w-8 max-w-8">{row.getValue('year') || 0}</div>;
                },
                size: 8,
                maxWidth: 8,
                minWidth: 8,
                header: () => <div></div>,
            },
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
                accessorKey: 'manufacturer_name',
                cell: ({ row }) => <div>{row.getValue('manufacturer_name') || ''}</div>,
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
                accessorKey: 'best_championship_position',
                cell: ({ row }) => <div>{intlNumberFormat(row.getValue('best_championship_position'))}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Best Champ Pos
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
                cell: ({ row }) => <div>{row.getValue('total_race_laps') || 0}</div>,
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
                cell: ({ row }) => <div>{row.getValue('total_podiums') || 0}</div>,
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

    const [whatTab, setWhatTab] = useState('enginesManufacturers');

    useEffect(() => {
        console.log('Current tab:', whatTab);
    }, [whatTab]);

    const tabs = [
        { value: 'chassis', label: 'Chassis', children: <div>Chassis</div> },
        {
            value: 'enginesManufacturers',
            label: 'Engine Manufacturers',
            children: (
                <DataTable className="w-fit" columns={enginesManufacturerColDefs} data={enginesManufacturers ?? []} />
            ),
        },
        { value: 'engines', label: 'Engines', children: <div>Engines</div> },
        { value: 'tires', label: 'Tires', children: <div>Tires</div> },
    ];

    return (
        <PageContainer title="Extra" showBreadcrumbs={true} lastCrumb="Extra">
            <Tabs defaultValue="enginesManufacturers" value={whatTab} className="max-w-[85vw] w-[85vw] overflow-hidden">
                {/* <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger 
                        value="chassis" 
                        className="cursor-pointer" onClick={() => setWhatTab('chassis')}>
                        Chassis
                    </TabsTrigger>
                    <TabsTrigger
                        value="enginesManufacturers"
                        className="cursor-pointer bg-zinc-800"
                        onClick={() => setWhatTab('enginesManufacturers')}
                    >
                        Engine Manufacturers
                    </TabsTrigger>
                    <TabsTrigger value="engines" className="cursor-pointer">
                        Engines
                    </TabsTrigger>
                    <TabsTrigger value="tires" className="cursor-pointer">
                        Tires
                    </TabsTrigger>
                </TabsList> */}

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

                <TabsContent value="enginesManufacturers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Engine Manufacturers</CardTitle>
                            {/* <CardDescription>
                                Make changes to your account here. Click save when youre done.???
                            </CardDescription> */}
                        </CardHeader>
                        <CardContent className="max-w-[96vw]">
                            <DataTable
                                className="w-fit"
                                columns={enginesManufacturerColDefs}
                                data={enginesManufacturers ?? []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, youll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Current password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New password</Label>
                                <Input id="new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
            {/* <Tabs defaultValue="account" className="w-[80vw]">
                <TabsList>
                    <TabsTrigger value="tires">Tires</TabsTrigger>
                    <TabsTrigger value="account">Engine Manufacturers</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DataTable className="w-fit" columns={enginesManufacturerColDefs} data={enginesManufacturers ?? []} />
                </TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs> */}
        </PageContainer>
    );
};
export default Extra;
