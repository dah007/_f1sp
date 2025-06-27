import Button from '@/components/Button';
import Flag from '@/components/Flag';
import { ManufacturerProps } from '@/types/constructors';
import { ColumnDef } from '@tanstack/react-table';
import memoize from 'lodash/memoize';
import { ArrowUpDown } from 'lucide-react';
import { intlNumberFormat } from './number';

const getManufacturerColDefs = memoize((): ColumnDef<ManufacturerProps>[] => [
    {
        accessorKey: 'alpha2_code',
        cell: ({ row }) => {
            return (
                <div className="min-w-8 w-8 max-w-8">
                    <Flag cCode={row.getValue('alpha2_code')} size={24} />
                </div>
            );
        },
        size: 8,
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
]);

export const manufacturerColDefs = getManufacturerColDefs();
