import { JSX, useState } from 'react';

import {
    ColumnFiltersState,
    GroupingState,
    PaginationState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { Input } from 'components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { DataTableProps, ExtendedColumnDef } from 'types/dataTable';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { BUTTON_CLASSES } from 'constants/constants';
import { cn } from '@/lib/utils';

/**
 * DataTable component for rendering a table with various functionalities such as filtering, sorting, and pagination.
 *
 * @template TData - The type of data being displayed in the table.
 * @template TValue - The type of value for the table cells.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} [props.additionalFilters] - Additional filter components to be rendered alongside the global filter.
 * @param {string} [props.className] - Additional class names to be applied to the table.
 * @param {Array<ColumnDef<TData, TValue>>} props.columns - The column definitions for the table.
 * @param {Array<TData>} props.data - The data to be displayed in the table.
 * @param {boolean} [props.useFilters=true] - Flag to determine whether to use filters or not.
 *
 * @returns {JSX.Element} The rendered DataTable component.
 */
const DataTable = <TData, TValue>({
    additionalFilters,
    className,
    columns,
    data,
    useFilters = true,
}: DataTableProps<TData, TValue>): JSX.Element => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [pagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 50,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const GetInVisibleColumn = (): Record<string, boolean> => {
        const inVisibleColumns: ExtendedColumnDef[] = columns.filter(
            (col) => 'visible' in col && col.visible === false,
        ) as unknown as ExtendedColumnDef[];

        const removedColumn = {} as Record<string, boolean>;

        for (const item of inVisibleColumns) {
            removedColumn[item.accessorKey as string] = false;
        }
        return removedColumn;
    };

    const [grouping, setGrouping] = useState<GroupingState>([]);

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        state: {
            columnFilters,
            grouping,
            pagination,
            sorting,
        },
        initialState: {
            columnVisibility: GetInVisibleColumn(),
        },
    });

    return (
        <div className={cn('flex', 'flex-col', 'gap-4', 'max-w-[95%]', className)}>
            {useFilters ? (
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Filter..."
                        value={table.getState().globalFilter ?? ''}
                        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                        className={`${BUTTON_CLASSES} max-w-[40%]`}
                    />
                    {additionalFilters}
                </div>
            ) : (
                <div className="mb-4"></div>
            )}

            <div className={cn('p-0', 'border', 'rounded-md', 'w-full', className)}>
                <ScrollArea className="h-[400px] w-[95vw]">
                    <ScrollBar />
                    <Table>
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
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
};

export default DataTable;
