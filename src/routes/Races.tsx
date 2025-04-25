import { JSX, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { RootState, useAppDispatch } from 'app/store';
import { useAppSelector } from 'hooks/reduxHooks';

import { useGetDriversQuery } from '../features/driversApi';
import { useGetRacesResultsWithQualQuery } from '../features/f1spRacesApi';

import { setDrivers } from 'slices/driversSlice';
import { setError, setSelectedYear } from 'slices/siteWideSlice';
import { setRaces } from 'slices/racesSlice';

import ButtonStyled from 'components/ButtonStyled';
import DataTable from 'components/DataTable';
import DropdownYears from 'components/YearsDropdown';
import MultiSelect from 'components/MultiSelect';
import PageContainer from 'components/PageContainer';
import TableSortHeader from 'components/TableSortHeader';
import { ColumnDef } from '@tanstack/react-table';
import { DistanceCellRenderer, LinkRenderer } from 'utils/dataTableRenderers';
import { FlagRendererById } from '../components/Flag';

import type { AdditionalFiltersYearProps } from 'types/index';
import type { Driver } from 'types/drivers';
import type { RaceProps } from 'types/races';
import RaceDetail from './RaceDetail';

export type OptionProps = {
    label: string;
    value: string;
};

/**
 * Races component displays a list of races for a selected year.
 * It allows users to filter races by year and drivers, and navigate to race details.
 *
 * @component
 * @example
 * return (
 *   <Races />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * This component uses Redux for state management and React Router for navigation.
 * It fetches race and driver data using custom hooks and displays the data in a table.
 *
 * @todo
 * - Clean up year handling logic.
 *
 * @requires
 * - useAppDispatch
 * - useAppSelector
 * - useNavigate
 * - useParams
 * - useGetRacesResultsWithQualQuery
 * - useGetDriversQuery
 * - setSelectedYear
 * - setDrivers
 * - setRaces
 * - setError
 *
 * @param {void}
 */
const Races: React.FC = (): JSX.Element => {
    // TODO: Clean up year handling
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);
    const races = useAppSelector((state: RootState) => state.races.races);

    const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
    const [driverOptions, setDriverOptions] = useState<OptionProps[]>([]);
    const [, setFilterBy] = useState<string>('');

    const { year: paramYear } = useParams() as { year: string };

    const [year, setYear] = useState<number | undefined>(paramYear ? parseInt(paramYear) : undefined);

    useEffect(() => {
        if (!year) setYear(selectedYear);
        if (year !== selectedYear) dispatch(setSelectedYear(year!));
    }, [paramYear, selectedYear, year, dispatch]);

    const navigateYearCB = (newYear: string) => {
        navigate(`/races/${newYear}`);
    };
    const navigateRace = (raceId: number) => navigate(`/races/${year}/race/${raceId}`);

    const { data: driversData } = useGetDriversQuery(selectedYear);
    useEffect(() => {
        if (!driversData) return;

        const tempOptions: OptionProps[] = [];

        driversData.forEach((driver: Driver) => {
            tempOptions.push({ label: driver.full_name, value: driver.id });
        });

        setDriverOptions(tempOptions);
        dispatch(setDrivers(driversData));
    }, [dispatch, driversData]);

    const { data: raceData, isError: isRacesError } = useGetRacesResultsWithQualQuery(year) as {
        data: RaceProps[];
        isError: boolean;
        isLoading: boolean;
    };
    useEffect(() => {
        if (!raceData) return;

        dispatch(setRaces(raceData));
    }, [dispatch, raceData]);

    const [colDefs] = useState<ColumnDef<RaceProps, unknown>[]>([
        {
            accessorKey: 'official_name',
            cell: ({ row }) => {
                return LinkRenderer({
                    gotoCB: () => {
                        navigateRace(row.original?.race_id as unknown as number);
                    },
                    label: row.getValue('official_name'),
                    value: row.original.race_id?.toString() ?? '',
                });
            },
            header: ({ column }) => <TableSortHeader<RaceProps> column={column} name="Name" />,
        },
        {
            accessorKey: 'nationality_country_id',
            cell: ({ row }) => {
                return <FlagRendererById countryId={row.getValue('nationality_country_id')} size={32} />;
            },
            header: () => <div className="min-w-4"></div>,
        },
        {
            accessorKey: 'full_name',
            cell: ({ row }) => row.getValue('full_name'),
            // header: () => <div className="min-w-8">Winner</div>,
            header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Winner" />,
        },
        {
            accessorKey: 'place_name',
            cell: ({ row }) => row.getValue('place_name'),
            header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Location" />,
        },
        {
            accessorKey: 'laps',
            cell: ({ row }) => row.getValue('laps'),
            header: () => <div className="min-w-4">Laps</div>,
        },
        {
            accessorKey: 'distance',
            cell: ({ row }) => DistanceCellRenderer({ value: row.getValue('distance') }),
            header: () => <div className="min-w-8">Distance (km)</div>,
        },
        {
            accessorKey: 'time',
            cell: ({ row }) => row.getValue('time'),
            header: ({ column }) => <TableSortHeader className="min-w-8" column={column} name="Lap Time" />,
        },
    ]);

    const onFilterTextBoxChanged = (event: React.FormEvent<HTMLInputElement>) => {
        dispatch(setSelectedYear(Number(event.currentTarget.value)));
        navigateYearCB(event.currentTarget.value);
    };

    const AdditionalFilters: React.FC<AdditionalFiltersYearProps> = ({
        onFilterTextBoxChanged,
        selectedYear,
    }: {
        onFilterTextBoxChanged: (event: React.FormEvent<HTMLInputElement>) => void;
        selectedYear: string;
    }) => (
        <div className="flex gap-4">
            <DropdownYears onFilterTextBoxChanged={onFilterTextBoxChanged} selectedYear={Number(selectedYear)} />

            <MultiSelect
                placeholder="Drivers"
                options={driverOptions}
                selectedOptions={selectedDrivers}
                setSelectedOptions={(values) => {
                    const drivers: string[] = values as unknown as string[];
                    setSelectedDrivers(values);
                    setFilterBy(drivers?.join(','));
                }}
            />

            {<ButtonStyled>Reset</ButtonStyled>}
        </div>
    );

    if (error || isRacesError) dispatch(setError(true));

    return (
        <PageContainer lastCrumb="Races" title="Races">
            <Routes>
                <Route path="race/:id" element={<RaceDetail />} />
            </Routes>

            <DataTable
                additionalFilters={AdditionalFilters({
                    onFilterTextBoxChanged,
                    selectedYear: selectedYear.toString(),
                })}
                classNames="w-full"
                columns={colDefs}
                data={races}
            />
        </PageContainer>
    );
};

export default Races;
