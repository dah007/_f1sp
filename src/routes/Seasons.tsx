import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import DataTable from 'components/DataTable';
import Flag from 'components/Flag';
import { LinkRenderer } from 'utils/dataTableRenderers';

import { setError, setSelectedYear } from 'slices/siteWideSlice';
import { setSeasonStats } from 'slices/seasonsSlice';
import { useGetSeasonStatsQuery } from 'features/seasonsApi';

import type { ISeason } from 'types/season';
import PageContainer from 'components/PageContainer';

/**
 * The `Seasons` component is a React functional component that displays a table of F1 seasons.
 * It fetches season statistics data and updates the Redux store with the fetched data.
 * The component also provides filtering options for selecting a specific year.
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the Seasons component.
 *
 * @example
 * <Seasons />
 *
 * @remarks
 * This component uses several hooks:
 * - `useAppDispatch` to dispatch actions to the Redux store.
 * - `useAppSelector` to select data from the Redux store.
 * - `useEffect` to handle side effects.
 * - `useGetSeasonStatsQuery` to fetch season statistics data.
 * - `useNavigate` to navigate programmatically.
 * - `useParams` to get URL parameters.
 *
 * The component defines several helper functions and components:
 * - `AdditionalFilters` to render additional filter options.
 * - `navigateYearCB` to handle navigation to a specific year.
 * - `onFilterTextBoxChanged` to handle changes in the filter text box.
 * - `rightAligned` to render right-aligned text.
 *
 * The component also defines column definitions for the data table using `useState`.
 *
 * @dependencies
 * - `DataTable`
 * - `Flag`
 * - `LinkRenderer`
 * - `Titles`
 * - `createColumnHelper`
 * - `useAppDispatch`
 * - `useAppSelector`
 * - `useEffect`
 * - `useGetSeasonStatsQuery`
 * - `useNavigate`
 * - `useParams`
 */
const Seasons: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const columnHelper = createColumnHelper<ISeason>();

    const selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);
    const seasons = useAppSelector((state: RootState) => state.seasons.seasons);
    let { year } = useParams() as { year: string };

    const { data: seasonsData, isError, isLoading } = useGetSeasonStatsQuery(selectedYear);

    useEffect(() => {
        if (!isError || isLoading) return;

        console.log('Error loading season stats');
        setError(isError);
    }, [isError, isLoading]);

    useEffect(() => {
        if (!seasonsData || isLoading || isError) return;

        dispatch(setSeasonStats(seasonsData.data));
    }, [dispatch, isError, isLoading, seasonsData]);

    if (!year) year = selectedYear.toString();

    if (year !== selectedYear.toString()) dispatch(setSelectedYear(parseInt(year)));

    const rightAligned = (value: string | number) => <div className="text-right">{value}</div>;

    const navigateYearCB = (newYear: string, url: string) => {
        dispatch(setSelectedYear(Number(newYear)));
        navigate(url);
    };

    const [colDefs] = useState<ColumnDef<ISeason, unknown>[]>([
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
                        {LinkRenderer({
                            gotoCB: () =>
                                navigateYearCB(
                                    row.getValue('year'),
                                    `/drivers/${selectedYear}/driver/${row.original.driverChampionId}`,
                                ),
                            label: row.getValue('driverChampion'),
                            value: row.original.driverChampionId,
                        })}
                    </div>
                );
            },
            header: () => <div className="min-w-8">Champion</div>,
        },
        {
            accessorKey: 'driverChampionPoints',
            cell: ({ row }) => rightAligned(row.getValue('driverChampionPoints')),
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
                    cell: (info) => rightAligned(info.getValue()),
                    header: () => <span>Drivers</span>,
                }),
                columnHelper.accessor('constructorCount', {
                    cell: (info) => rightAligned(info.getValue()),
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
        <PageContainer lastCrumb="Seasons" title="Seasons">
            <DataTable classNames="w-full min-w-[90%]" columns={colDefs} data={seasons} />
        </PageContainer>
    );
};

export default Seasons;
