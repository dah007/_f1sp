import type { ExtendedColumnDef } from "@/types/dataTable";

export const GetInVisibleColumn = (colDefs: ExtendedColumnDef[]): Record<string, boolean> => {
    const inVisibleColumns: ExtendedColumnDef[] = colDefs.filter(
        (col) => 'visible' in col && col.visible === false,
    ) as unknown as ExtendedColumnDef[];

    const removedColumn = {} as Record<string, boolean>;

    for (const item of inVisibleColumns) {
        removedColumn[item.accessorKey as string] = false;
    }
    return removedColumn;
};

export const pagination = {
    pageIndex: 0,
    pageSize: 1000, // default page size is only 10...
};