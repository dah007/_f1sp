import type { ExtendedColumnDef } from '@/types/dataTable';
import { RaceProps } from '@/types/races';

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

type Item = {
    id: string;
    points?: number;
    position_number: number;
    year: number;
};

// input: your array of results
export const groupWinnersWithChildren = (arr: Record<string, RaceProps>[]) => {
    // Group by id
    const grouped: Record<string, Item[]> = {};

    arr.forEach((item: Record<string, RaceProps>) => {
        const typedItem = item as unknown as Item;
        if (!grouped[typedItem.id]) grouped[typedItem.id] = [];
        grouped[typedItem.id].push(typedItem);
    });

    // For each group, find position 1 and attach children
    const result = Object.values(grouped)
        .map((group) => {
            const parent = group.find((item) => item.position_number === 1);
            if (!parent) return null; // skip if no winner
            const children = group.filter((item) => item.position_number !== 1 && item.position_number != null);
            return {
                ...parent,
                children,
            };
        })
        .filter(Boolean); // remove nulls

    // sort by year, then position, then points
    return result.sort((a, b) => {
        if (!a || !b) return 0; // handle nulls
        if (a.year !== b.year) return a.year - b.year;
        if (a.position_number !== b.position_number) return a.position_number - b.position_number;
        return (b.points || 0) - (a.points || 0); // sort by points descending
    });

    // return result;
};
