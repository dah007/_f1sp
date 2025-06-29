import { ColumnDef } from '@tanstack/react-table';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { JSX, useEffect, useMemo, useState } from 'react';

import DataTable from 'components/DataTable';
import Flag from 'components/Flag';
import PageContainer from 'components/PageContainer';
import { Button } from 'components/ui/button';

import { intlNumberFormat } from 'utils/number';

import { useGetConstructorsQuery } from 'features/constructorsApi';
import { setConstructors } from 'slices/constructorsSlice';

import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import { ArrowUpDown } from 'lucide-react';
import { type ConstructorProps } from 'types/constructors';

const Constructors: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const constructors = useAppSelector((state: RootState) => state.constructors.constructors);
    const [isLoaded, setIsLoaded] = useState(false);

    const { data: constructorsData } = useGetConstructorsQuery(undefined);

    useEffect(() => {
        if (!constructorsData) return;
        dispatch(setConstructors(Array.isArray(constructorsData) ? constructorsData : [constructorsData]));
        setIsLoaded(true); // Mark data as loaded
    }, [constructorsData, dispatch, isLoaded, constructors]);

    const colDefs = useMemo<ColumnDef<ConstructorProps>[]>(
        () => [
            {
                accessorKey: 'country_id',
                cell: ({ row }) => {
                    return (
                        <div className="min-w-8 w-8 max-w-8">
                            <Flag nameAsId={row.getValue('country_id')} size={24} />
                        </div>
                    );
                },
                size: 8,
                maxWidth: 8,
                minWidth: 8,
                header: () => <div></div>,
            },
            {
                accessorKey: 'name',
                cell: ({ row }) => <div>{row.getValue('name')}</div>,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'full_name',
                cell: ({ row }) => <div>{row.getValue('full_name')}</div>,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Full Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'total_points',
                cell: ({ row }) => <div>{intlNumberFormat(row.getValue('total_points'))}</div>,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Total Points
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'total_podiums',
                cell: ({ row }) => <div>{intlNumberFormat(row.getValue('total_podiums'))}</div>,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Podiums
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'total_race_laps',
                cell: ({ row }) => <div>{intlNumberFormat(row.getValue('total_race_laps'))}</div>,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Race
                        <br />
                        Laps
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'total_race_wins',
                cell: ({ row }) => <div>{intlNumberFormat(row.getValue('total_race_wins'))}</div>,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Race
                        <br />
                        Wins
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
        ],
        [],
    );

    const page = useMemo(() => {
        return {
            pageIndex: 0,
            pageSize:
                constructors.map((d) => `${d.subRows}`?.length ?? 0).reduce((acc, val) => acc + val, 0) +
                constructors.length,
        };
    }, [constructors]);

    return (
        <PageContainer lastCrumb="Constructors" title="Constructors">
            <ScrollArea className="h-[calc(100vh-10rem)]">
                <Scrollbar className="w-2 bg-slate-200" />
                <DataTable className="w-fit" columns={colDefs} data={constructors ?? []} pagination={page} />
            </ScrollArea>
        </PageContainer>
    );
};

export default Constructors;
