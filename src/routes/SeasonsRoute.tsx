import { useEffect, useState } from 'react';

import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { setError, setLoading } from '@/slices/systemWideSlice';
import { useGetSeasonStatsQuery } from 'features/seasonsApi';

import DataTable from '@/components/DataTable';
import Flag from '@/components/Flag';
import { setSeasons } from '@/slices/seasonsSlice';
import { LinkRenderer } from '@/utils/dataTableRenderers';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import type { Season } from 'types/season';

const Seasons: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const columnHelper = createColumnHelper<Season>();

    const selectedYear = useAppSelector((state: RootState) => state.systemWide.selectedYear);
    const seasons = useAppSelector((state: RootState) => state.seasons.seasons);

    // let { year } = useParams() as { year: string };

    const rightAligned = (value: string | number) => {
        return <div className="text-right">{value}</div>;
    };

    const {
        data: seasonsData,
        isError,
        isLoading,
    } = useGetSeasonStatsQuery(selectedYear) as {
        data: Season[] | undefined;
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        if (isError) {
            dispatch(setError(true));
            return;
        }
        if (isLoading) {
            dispatch(setError(false));
            dispatch(setLoading(true));
            return;
        }
        if (!seasonsData) return;

        console.log('Seasons Data:', seasonsData);
        dispatch(setLoading(false));
        dispatch(setSeasons(seasonsData));
    }, [dispatch, isError, isLoading, seasonsData]);

    const [colDefs] = useState<ColumnDef<Season, unknown>[]>([
        {
            accessorKey: 'year',
            cell: ({ row }) => {
                return LinkRenderer({
                    gotoCB: () => navigate(`/races/${selectedYear}`),
                    label: row.getValue('year'),
                    value: row.original.year?.toString(),
                });
            },
            header: () => <div className="min-w-">Year</div>,
        },
        {
            accessorKey: 'driverChampion',
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Flag nameAsId={row.original.driverNationality} size={32} />
                        {row.getValue('driverChampion')}
                    </div>
                );
            },
            header: () => <div className="min-w-8">Champion</div>,
        },
        {
            accessorKey: 'driverChampionPoints',
            cell: ({ row }) => row.getValue('driverChampionPoints'),
            header: () => <div className="min-w-8">Points</div>,
        },
        {
            accessorKey: 'constructorChampion',
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Flag nameAsId={row.original.constructorCountry} size={32} />
                        {LinkRenderer({
                            gotoCB: () => navigate(`/constructors/${row.original.constructorId}`),
                            label: row.getValue('constructorChampion'),
                            value: row.original.driverChampionId,
                        })}
                    </div>
                );
            },
            header: () => <div className="min-w-10">Constructor</div>,
        },
        {
            accessorKey: 'constructorPoints',
            cell: ({ row }) => rightAligned(row.getValue('constructorPoints')),
            header: () => <div className="min-w-8">Points</div>,
        },
        {
            accessorKey: 'constructorEngine',
            cell: ({ row }) => row.getValue('constructorEngine'),
            header: () => <div className="min-w-8">Engine</div>,
        },
        {
            id: 'totals',
            header: () => <div className="pl-6 text-center border-l">Totals:</div>,
            columns: [
                columnHelper.accessor('driverCount', {
                    cell: (info: { getValue: () => string | number }) => rightAligned(info.getValue()),
                    header: () => <span>Drivers</span>,
                }),
                columnHelper.accessor('constructorCount', {
                    cell: (info: { getValue: () => string | number }) => rightAligned(info.getValue()),
                    header: () => <span>Constructors</span>,
                }),
                columnHelper.accessor('raceCount', {
                    cell: (info) => rightAligned(info.getValue()),
                    header: () => <span>Races</span>,
                }),
                columnHelper.accessor('totalLaps', {
                    cell: (info) => rightAligned(info.getValue()),
                    header: () => <span>Laps</span>,
                }),
            ],
        },
    ]);

    return (
        <div>
            <p className="font-bold mb-4">hello</p>
            <DataTable data={seasons} columns={colDefs} />
        </div>
    );
};

export default Seasons;
