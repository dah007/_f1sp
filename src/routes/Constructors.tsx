import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { JSX, useEffect } from 'react';

import { useGetConstructorsQuery } from 'features/constructorsApi';
import { setConstructors } from 'slices/constructorsSlice';
import { setError } from 'slices/siteWideSlice';

import Flag from 'components/Flag';
import PageContainer from 'components/PageContainer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';

import { intlNumberFormat } from 'utils/number';
import { type ConstructorProps } from 'types/constructors';
import CardLoading from '@/components/CardLoading';

const Constructors = (): JSX.Element => {
    const constructors = useAppSelector((state: RootState) => state.constructors.constructors);
    const dispatch = useAppDispatch();

    const {
        data: constructorsData,
        isLoading: constructorsLoading,
        isError: constructorsError,
    } = useGetConstructorsQuery(2024);

    useEffect(() => {
        if (!constructorsData) return;
        console.log('constructorsData', constructorsData);
        dispatch(setConstructors(constructorsData));
    }, [constructorsData, dispatch]);

    if (constructorsLoading) {
        return <CardLoading isLoading={constructorsLoading} />;
    }

    if (constructorsError) {
        dispatch(setError(true));
        return <div>Error loading constructors data.</div>;
    }

    return (
        <PageContainer title="Constructors">
            <div className="w-full border rounded-lg">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2}></TableHead>
                            <TableHead colSpan={3}>Best</TableHead>
                            <TableHead colSpan={12}>Totals</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead className="w-26">Full Name</TableHead>

                            <TableHead className="w-22 max-w-24">Champ Position</TableHead>
                            <TableHead className="w-22 max-w-24">Grid Position</TableHead>
                            <TableHead className="w-22 max-w-24">Race Result</TableHead>

                            <TableHead className="w-22 max-w-24">Champ Wins</TableHead>
                            <TableHead className="w-22 max-w-24">Entries</TableHead>
                            <TableHead className="w-22 max-w-24">Starts</TableHead>
                            <TableHead className="w-22 max-w-24">Race Wins</TableHead>
                            <TableHead className="w-22 max-w-24">1-2 Finishes</TableHead>
                            <TableHead className="w-22 max-w-24">Race Laps</TableHead>
                            <TableHead className="w-22 max-w-24">Podiums</TableHead>
                            <TableHead className="w-22 max-w-24">Podium Races</TableHead>
                            <TableHead className="w-22 max-w-24">Points</TableHead>
                            <TableHead className="w-22 max-w-24">Champ Points</TableHead>
                            <TableHead className="w-22 max-w-24">Pole Positions</TableHead>
                            <TableHead className="w-22 max-w-24">Fastest Laps</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {constructors.map((constructor: ConstructorProps) => {
                            return (
                                <TableRow key={constructor.id}>
                                    <TableCell className="w-12 text-center">
                                        <Flag cCode={constructor.alpha2_code} size={24} />
                                    </TableCell>
                                    <TableCell>{constructor.full_name}</TableCell>
                                    <TableCell className="text-right">
                                        {constructor.best_championship_position}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {constructor.best_starting_grid_position}
                                    </TableCell>
                                    <TableCell className="text-right">{constructor.best_race_result}</TableCell>
                                    <TableCell className="text-right">{constructor.total_championship_wins}</TableCell>
                                    <TableCell className="text-right">{constructor.total_race_entries}</TableCell>
                                    <TableCell className="text-right">{constructor.total_race_starts}</TableCell>
                                    <TableCell className="text-right">{constructor.total_race_wins}</TableCell>
                                    <TableCell className="text-right">{constructor.total_1_and_2_finishes}</TableCell>
                                    <TableCell className="text-right">
                                        {intlNumberFormat(constructor.total_race_laps)}
                                    </TableCell>
                                    <TableCell className="text-right">{constructor.total_podiums}</TableCell>
                                    <TableCell className="text-right">{constructor.total_podium_races}</TableCell>
                                    <TableCell className="text-right">
                                        {intlNumberFormat(constructor.total_points)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {intlNumberFormat(constructor.total_championship_points)}
                                    </TableCell>
                                    <TableCell className="text-right">{constructor.total_pole_positions}</TableCell>
                                    <TableCell className="text-right">{constructor.total_fastest_laps}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </PageContainer>
    );
};

export default Constructors;
