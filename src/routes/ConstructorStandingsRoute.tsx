import { RootState, useAppSelector } from '@/app/store';
import CardContainer from '@/components/CardContainer';
import TeamPerformanceRadar from '@/components/charts/TeamPerformanceRadar';
import ConstructorStandingsTable from '@/components/ConstructorsStandingsTable';
import PageContainer from '@/components/PageContainer';
import { YEAR } from '@/constants/constants';
import { useGetConstructorStandingsQuery } from '@/features/standingsApi';
import { cn } from '@/lib/utils';
import { selectConstructorStandings } from '@/selectors/standingsSelector';
import { setConstructorStandings } from '@/slices/standingsSlice';
import { ConstructorStanding } from '@/types/standings';
import { removeDuplicates } from '@/utils';
import { JSX, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export interface ColorizedConstructorProps {
    short_name?: string;
    full_name: string;
    cName?: string;
    constructor_id: string;
    emName: string;
    fill: string;
    points: number;
    position_number: number;
    year: number;
}

const ConstructorStandings: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();

    const selectedYear = useAppSelector((state: RootState) => state.systemWide.selectedYear);

    const { data: constructorsData } = useGetConstructorStandingsQuery(selectedYear ?? YEAR) as {
        data: ConstructorStanding[] | undefined;
    };
    const colorConstructors = useAppSelector((state: RootState) =>
        selectConstructorStandings(state),
    ) satisfies ColorizedConstructorProps[];

    useEffect(() => {
        if (!constructorsData) return;
        dispatch(setConstructorStandings(constructorsData));
        console.log('constructorsData', constructorsData);
    }, [dispatch, constructorsData]);

    return (
        <PageContainer
            title={`Constructor Standings ${selectedYear ?? YEAR}`}
            showTitle={true}
            showBreadcrumbs={true}
            lastCrumb="Constructors"
        >
            <CardContainer className={cn('w-full')}>
                <div className="flex flex-col md:flex-row w-full gap-4">
                    <div className="w-full">
                        <TeamPerformanceRadar data={removeDuplicates(colorConstructors, 'constructor_id')} />
                    </div>
                    <div className="flex-1">
                        <ConstructorStandingsTable />
                    </div>
                </div>
            </CardContainer>
            {/* </CardContainer> */}
        </PageContainer>
    );
};

export default ConstructorStandings;
