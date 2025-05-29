import Button from '@/components/Button';
import Flag from '@/components/Flag';
import { RaceResultProps } from '@/types/races';
import { LinkRenderer } from '@/utils/dataTableRenderers';
import { intlNumberFormat } from '@/utils/number';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const colDefs = (): ColumnDef<RaceResultProps>[] => [
    {
        accessorKey: 'result_time',
        size: 40,
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
        header: () => <div></div>,
    },
    {
        accessorKey: 'driver',

        cell: ({ row }) =>
            LinkRenderer({
                gotoCB: () => `/drivers/${row.getValue('driver_id')}`,
                label: row.getValue('driver'),
                value: row.original.id as unknown as string,
            }),
        size: 40,
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
];
