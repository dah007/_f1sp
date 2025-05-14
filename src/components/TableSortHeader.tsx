import { JSX } from 'react/jsx-runtime';
import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

import { ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';

type TableSortHeaderProps<TData> = {
    className?: string;
    column: Column<TData, unknown>;
    name: string;
};

/**
 * A component that renders a sortable table header.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.className - Additional class names for the button.
 * @param {Object} props.column - The column object containing sorting information.
 * @param {string} props.name - The display name of the column.
 *
 * @returns {JSX.Element} The rendered TableSortHeader component.
 */
const TableSortHeader = <TData,>({ className, column, name }: TableSortHeaderProps<TData>): JSX.Element => (
    <Button
        variant="ghost"
        className={cn(className, 'font-bold', 'whitespace-pre-wrap')}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
        <ArrowUpDown className="w-4 h-4 ml-2" />
        {name}
    </Button>
);

export default TableSortHeader;
