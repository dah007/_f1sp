// TODO: clean this file up
import type { ExtendedColumnDef } from '@/types/dataTable';

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

export type Item = {
    id: string;
    points?: number;
    position_number: number;
    year: number;
};

export type ItemWithChildren = Item & { children: Item[] };

// input: your array of results
export const groupWinnersWithChildren = (arr: Item[]): ItemWithChildren[] => {
    // Filter out objects missing required fields
    const validArr = arr.filter(
        (item) =>
            typeof item.id !== 'undefined' && typeof item.position_number === 'number' && typeof item.year === 'number',
    );

    // Group by id
    const grouped: Record<string, Item[]> = {};
    validArr.forEach((item: Item) => {
        if (!grouped[item.id]) grouped[item.id] = [];
        grouped[item.id].push(item);
    });

    // For each group, find position 1 and attach children
    const result: ItemWithChildren[] = Object.values(grouped)
        .map((group) => {
            const parent = group.find((item) => item.position_number === 1);
            if (!parent) return null; // skip if no winner
            const children = group.filter(
                (item) => item.position_number !== 1 && typeof item.position_number === 'number',
            );
            return {
                ...parent,
                children,
            };
        })
        .filter(Boolean) as ItemWithChildren[]; // remove nulls

    // sort by year, then position, then points
    return result.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.position_number !== b.position_number) return a.position_number - b.position_number;
        return (b.points || 0) - (a.points || 0); // sort by points descending
    });
};

export const rightAligned = (value: string | number) => {
    return <div className="text-right">{value}</div>;
};
