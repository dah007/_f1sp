import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { ColumnDef } from '@tanstack/react-table';

import { setDrivers } from '../slices/driversSlice';
import { useGetDriversQuery } from '../features/driversApi';
import { useNavigate } from 'react-router-dom';

import DataTable from 'components/DataTable';
import DropdownYears from 'components/YearsDropdown';
import Flag from 'components/Flag';
import PageContainer from 'components/PageContainer';
import { AdditionalFiltersYearProps } from 'types/index';
import { ArrowUpDown } from 'lucide-react';
import { Button } from 'components/ui/button';
import { intlNumberFormat } from 'utils/number';
import { setSelectedYear } from 'slices/siteWideSlice';

import { type Driver } from 'types/drivers';

/**
 * `Drivers` is a React functional component that displays a list of drivers by year.
 * It fetches driver data based on the selected year and allows navigating to driver details.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * ```tsx
 * <Drivers />
 * ```
 *
 * @remarks
 * This component uses Redux for state management and React Router for navigation.
 * It also utilizes the `useGetDriversQuery` hook to fetch driver data.
 *
 * @hook
 * - `useAppDispatch` to dispatch actions to the Redux store.
 * - `useAppSelector` to select state from the Redux store.
 * - `useNavigate` to navigate between routes.
 * - `useGetDriversQuery` to fetch driver data based on the selected year.
 * - `useEffect` to update the component when driver data changes.
 * - `useState` to manage local state for loading status and column definitions.
 *
 * @returns {JSX.Element} The rendered component.
 */
const Drivers: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    let selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);

    const drivers = useAppSelector((state: RootState) => state.drivers.drivers);
    const [isLoaded, setIsLoaded] = useState(false);

    const navigate = useNavigate();
    const navigateYearCB = (newYear: string) => {
        setIsLoaded(false);
        dispatch(setSelectedYear(Number(newYear)));
        navigate(`/drivers/${newYear}`);
    };
    const navigateDriver = useCallback(
        (driverId: string) => {
            navigate(`/drivers/${selectedYear}/driver/${driverId}`);
        },
        [navigate, selectedYear],
    );

    const onFilterTextBoxChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const newYear = Number(event.currentTarget.value);
        dispatch(setSelectedYear(newYear));
        navigateYearCB(newYear.toString());
        selectedYear = newYear;
    };

    const { data: driversData } = useGetDriversQuery(selectedYear);

    useEffect(() => {
        if (!driversData) return;
        dispatch(setDrivers(driversData));
        setIsLoaded(true); // Mark data as loaded
    }, [driversData, dispatch, isLoaded, drivers]);

    const colDefs = useMemo<ColumnDef<Driver>[]>(
        () => [
            {
                accessorKey: 'nationality_country_id',
                cell: ({ row }) => {
                    return (
                        <div className="min-w-8 w-8 max-w-8">
                            {Flag({ nameAsId: row.getValue('nationality_country_id'), size: 24 })}
                        </div>
                    );
                },
                size: 8,
                maxWidth: 8,
                minWidth: 8,
                header: () => <div></div>,
            },
            {
                accessorKey: 'permanent_number',
                size: 20,
                maxWidth: 20,
                minWidth: 20,
                cell: ({ row }) => <div className="text-right">{row.getValue('permanent_number')}</div>,
                header: () => <div className="text-right">#</div>,
            },
            {
                accessorKey: 'abbreviation',
                cell: ({ row }) => <div className="text-right">{row.getValue('abbreviation')}</div>,
                header: () => <div className="text-right"></div>,
            },
            {
                accessorKey: 'first_name',
                cell: ({ row }) => (
                    <div
                        role="link"
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => navigateDriver(row.original.id)}
                    >
                        {row.getValue('first_name')}
                    </div>
                ),
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        First Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'last_name',
                cell: ({ row }) => (
                    <div
                        role="link"
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => navigateDriver(row.original.id)}
                    >
                        {row.getValue('last_name')}
                    </div>
                ),
                size: 40,
                maxWidth: 40,
                header: ({ column }) => (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Last Name
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    </Button>
                ),
            },
            {
                accessorKey: 'best_championship_position',
                cell: ({ row }) => <div className="text-right">{row.getValue('best_championship_position')}</div>,
                header: ({ column }) => {
                    return (
                        <>
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                            <Button
                                variant="ghost"
                                className="flex flex-col"
                                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            >
                                <span>Champ Pos</span>
                            </Button>
                        </>
                    );
                },
            },
            {
                accessorKey: 'best_race_result',
                cell: ({ row }) => <div className="text-right">{row.getValue('best_race_result')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Race Result
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_championship_wins',
                cell: ({ row }) => <div className="text-right">{row.getValue('total_championship_wins')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Championships
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_race_wins',
                cell: ({ row }) => <div className="text-right">{row.getValue('total_race_wins')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Wins
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_points',
                cell: ({ row }) => <div className="text-right">{intlNumberFormat(row.getValue('total_points'))}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Total Points
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
            {
                accessorKey: 'total_fastest_laps',
                cell: ({ row }) => <div className="text-right">{row.getValue('total_fastest_laps')}</div>,
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Fastest Laps
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    );
                },
            },
        ],
        [navigateDriver],
    );

    const AdditionalFilters: React.FC<AdditionalFiltersYearProps> = ({
        onFilterTextBoxChanged,
        selectedYear,
    }: AdditionalFiltersYearProps) => (
        <DropdownYears onFilterTextBoxChanged={onFilterTextBoxChanged} selectedYear={Number(selectedYear)} />
    );

    return (
        <PageContainer lastCrumb="Drivers" title="Drivers">
            <DataTable
                className="w-fit"
                columns={colDefs}
                data={drivers ?? []}
                additionalFilters={AdditionalFilters({
                    onFilterTextBoxChanged,
                    selectedYear: selectedYear.toString(),
                })}
            />
        </PageContainer>
    );
};

export default Drivers;
