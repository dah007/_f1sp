/**
 * Props for the DataTable component.
 *
 * @template TData - The type of data being displayed in the table.
 * @template TValue - The type of value for each column.
 *
 * @property {JSX.Element | React.ReactNode} [additionalFilters] - Optional additional filters to be displayed.
 * @property {string} [classNames] - Optional class names to be applied to the table.
 * @property {ColumnDef<TData, TValue>[]} columns - The column definitions for the table.
 * @property {TData[]} data - The data to be displayed in the table.
 * @property {{ [key: string]: boolean }} [hideColumns] - Optional object to specify which columns should be hidden.
 * @property {boolean} [useFilters] - Optional flag to indicate if filters should be used.
 */

/**
 * Extended column definition interface.
 *
 * @property {string} accessorKey - The key to access the column data.
 * @property {boolean} [visible] - Optional flag to indicate if the column is visible.
 */
import type { ColumnDef } from '@tanstack/react-table';

export interface DataTableProps<TData, TValue> {
    additionalFilters?: JSX.Element | React.ReactNode;
    className?: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    hideColumns?: { [key: string]: boolean };
    useFilters?: boolean;
}

export interface DataTableProps<TData, TValue> {
    additionalFilters?: JSX.Element | React.ReactNode;
    classNames?: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    hideColumns?: { [key: string]: boolean };
    useFilters?: boolean;
}

export interface ExtendedColumnDef {
    accessorKey: string;
    visible?: boolean;
}

