import type { ExtendedColumnDef } from '@/types/dataTable';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GetInVisibleColumn, groupWinnersWithChildren, Item, pagination, rightAligned } from '../../utils/tables';

describe('GetInVisibleColumn', () => {
    it('should return empty object when given empty array', () => {
        const result = GetInVisibleColumn([]);
        expect(result).toEqual({});
    });

    it('should include columns with visible=false in result', () => {
        const columns = [
            { accessorKey: 'name', visible: false } as ExtendedColumnDef,
            { accessorKey: 'age', visible: true } as ExtendedColumnDef,
            { accessorKey: 'email' } as ExtendedColumnDef,
        ];
        const result = GetInVisibleColumn(columns);
        expect(result).toEqual({ name: false });
    });

    it('should handle multiple invisible columns', () => {
        const columns = [
            { accessorKey: 'name', visible: false } as ExtendedColumnDef,
            { accessorKey: 'age', visible: false } as ExtendedColumnDef,
            { accessorKey: 'email', visible: true } as ExtendedColumnDef,
        ];
        const result = GetInVisibleColumn(columns);
        expect(result).toEqual({ name: false, age: false });
    });

    it('should exclude columns without visible property', () => {
        const columns = [{ accessorKey: 'name' } as ExtendedColumnDef, { accessorKey: 'age' } as ExtendedColumnDef];
        const result = GetInVisibleColumn(columns);
        expect(result).toEqual({});
    });
});

describe('pagination', () => {
    it('should have correct default values', () => {
        expect(pagination).toEqual({
            pageIndex: 0,
            pageSize: 1000,
        });
    });
});

describe('groupWinnersWithChildren', () => {
    it('should return empty array when given empty array', () => {
        const result = groupWinnersWithChildren([]);
        expect(result).toEqual([]);
    });

    it('should correctly group items by id', () => {
        const items: Item[] = [
            { id: 'A', position_number: 1, year: 2020, points: 100 },
            { id: 'A', position_number: 2, year: 2020, points: 80 },
            { id: 'B', position_number: 1, year: 2020, points: 90 },
        ];

        const result = groupWinnersWithChildren(items);
        expect(result).toHaveLength(2); // 2 groups (A and B)

        // Find group A
        const groupA = result.find((g) => g?.id === 'A');
        expect(groupA).toBeDefined();
        expect(groupA?.children).toHaveLength(1);
        expect(groupA?.children[0].position_number).toBe(2);

        // Find group B
        const groupB = result.find((g) => g?.id === 'B');
        expect(groupB).toBeDefined();
        expect(groupB?.children).toHaveLength(0);
    });

    it('should skip groups without a winner (position 1)', () => {
        const items: Item[] = [
            { id: 'A', position_number: 1, year: 2020, points: 100 },
            { id: 'A', position_number: 2, year: 2020, points: 80 },
            { id: 'B', position_number: 2, year: 2020, points: 90 }, // No position 1
            { id: 'B', position_number: 3, year: 2020, points: 70 },
        ];

        const result = groupWinnersWithChildren(items);
        expect(result).toHaveLength(1); // Only group A has a winner
        expect(result[0]?.id).toBe('A');
    });

    it('should correctly sort results by year, position, and points', () => {
        const items: Item[] = [
            { id: 'A', position_number: 1, year: 2021, points: 80 },
            { id: 'B', position_number: 1, year: 2020, points: 90 },
            { id: 'C', position_number: 1, year: 2021, points: 100 },
            { id: 'D', position_number: 1, year: 2020, points: 120 },
        ];

        const result = groupWinnersWithChildren(items);

        expect(result).toHaveLength(4); // 4 groups (A, B, C, D)
        // First by year (2020 before 2021)
        expect(result[0]?.id).toBe('D'); // 2020 with highest points
        expect(result[1]?.id).toBe('B'); // 2020 with lower points
        expect(result[2]?.id).toBe('C'); // 2021 with highest points
        expect(result[3]?.id).toBe('A'); // 2021 with lower points
    });

    it('should filter out nulls from children', () => {
        const items: Item[] = [
            { id: 'A', position_number: 1, year: 2020, points: 100 },
            { id: 'A', position_number: null as unknown as number, year: 2020, points: 80 },
        ];

        const result = groupWinnersWithChildren(items);
        expect(result[0]?.children).toHaveLength(0);
    });
});

describe('rightAligned', () => {
    it('should render string value in right-aligned div', () => {
        const { container } = render(rightAligned('Hello'));
        const div = container.firstChild as HTMLElement;

        expect(div.className).toBe('text-right');
        expect(div.textContent).toBe('Hello');
    });

    it('should render number value in right-aligned div', () => {
        const { container } = render(rightAligned(42));
        const div = container.firstChild as HTMLElement;

        expect(div.className).toBe('text-right');
        expect(div.textContent).toBe('42');
    });
});
