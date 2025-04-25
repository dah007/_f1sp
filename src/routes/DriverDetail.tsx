import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { useGetDriverQuery, useGetDriverStatsQuery, useGetDriverTotalPositionsQuery } from 'features/driversApi';
import { setDriver, setStats, setTotalPositions } from 'slices/driversSlice';

import PageContainer from 'components/PageContainer';
import Flag from 'components/Flag';

// import { BarChart, Bar, XAxis, YAxis, Label } from 'recharts';

import { PositionData } from 'types/drivers';
import { setError } from 'slices/siteWideSlice';
// import Chart from '@/components/Chart';
import { BarChart, Bar, Label, XAxis, YAxis } from 'recharts';

// import { checkImageExists } from '@/utils';

const DriverDetail: React.FC = () => {
    const dispatch = useAppDispatch();
    const { id, year } = useParams();

    const [maxPercentage, setMaxPercentage] = useState(0);

    const driver = useAppSelector((state: RootState) => state.drivers.driver);
    const driverPositions = useAppSelector((state: RootState) => state.drivers.driverPositions);
    const driverPositionTotals = useAppSelector((state: RootState) => state.drivers.totalPositions);
    // const podiums = useAppSelector((state: RootState) => state.drivers.podiumData);
    const stats = useAppSelector((state: RootState) => state.drivers.stats);

    const [totalPositionNumber, setTotalPositionNumber] = useState<PositionData[]>([]);

    const {
        data: driverPositionsData,
        // isLoading: driverPositionsLoading,
        isError: driverPositionsError,
    } = useGetDriverTotalPositionsQuery(id);

    const { data: driverData, isLoading: driverDataLoading, isError: driverDataError } = useGetDriverQuery(id);
    const { data: statData, isLoading: statDataLoading, isError: statDataError } = useGetDriverStatsQuery(id);

    useEffect(() => {
        if (!driverData || driverDataError || driverDataLoading) return;

        dispatch(setDriver(driverData[0]));
    }, [dispatch, driverData, driverDataError, driverDataLoading]);

    useEffect(() => {
        if (!statData || statDataError || statDataLoading) return;

        console.log('statData:', statData);
        dispatch(setStats(statData));
    }, [dispatch, statData, statDataError, statDataLoading]);

    useEffect(() => {
        if (!driverPositionsData) return;
        setTotalPositionNumber(driverPositionsData);
        // Calculate max percentage for chart scaling
        const maxCount = driverPositionsData.reduce((max: number, item: PositionData) => {
            return item.count > max ? item.count : max;
        }, 0);
        setMaxPercentage(Math.ceil(maxCount * 1.1)); // Add 10% buffer for chart display
    }, [
        dispatch,
        driverPositions,
        driverPositionsData,
        driverPositionTotals,
        driverData,
        driverDataError,
        driverDataLoading,
    ]);

    useEffect(() => {
        if (driverDataError || driverPositionsError) dispatch(setError(true));
    }, [driverDataError, driverPositionsError, dispatch]);

    // TODO: Fix this function
    const imageCallBack = (/*img: string*/) => {
        // if (checkImageExists(img)) {
        return (
            <div className="flex justify-end lg:h-96 md:h-48 sm:h-24">
                <img
                    src={`/src/assets/drivers/${year}/${driver?.id}.png`}
                    alt={driver?.full_name}
                    className="object-cover max-h-[100%]"
                />
                <div className="absolute pr-4">
                    <Flag
                        nameAsId={driver?.country_of_birth_country_id}
                        size={64}
                        sizes={{
                            lg: 'lg:w-20',
                            md: 'md:w-14',
                            base: 'w-10',
                        }}
                    />
                </div>
            </div>
        );
        // }
        // return <></>;
    };

    useEffect(() => {
        if (totalPositionNumber && totalPositionNumber.length <= 0) return;

        // ? this will be the final array, nulls clears, proper db value
        const aryBlanksFilled: PositionData[] = [];

        // remove the nulls
        const filteredArray: PositionData[] = driverPositionsData.filter(
            (item: PositionData) => item.position_number !== null,
        );
        // fill in the missing positions
        for (let i = 0; i < 20; i++) {
            const tempPosition = filteredArray.find((position) => position.position_number === i + 1);

            if (tempPosition) {
                aryBlanksFilled.push(tempPosition);
            } else {
                aryBlanksFilled.push({
                    count: 0,
                    position_number: i + 1,
                });
            }
        }

        dispatch(setTotalPositions(aryBlanksFilled));
        setTotalPositionNumber(aryBlanksFilled);
    }, [driverPositionsData, dispatch, totalPositionNumber]);

    type ChartConfig = {
        [key: string]: {
            label: string;
            color: string;
        };
    };

    const cConfig: ChartConfig = {};

    driverPositionTotals?.forEach((position) => {
        cConfig[position.position_number || ''] = {
            label: position.position_number?.toString() || '',
            color: 'hsl(var(--chart-1))',
        };
    });

    return (
        <PageContainer lastCrumb={driver?.full_name} title="" showTitle={false}>
            <div className="flex w-full rounded-lg lg:h-96 md:h-48 sm:h-24 bg-blue-950">
                <div className="relative flex w-full">
                    <div className="absolute top-0 left-0 font-bold lg:text-9xl md:text-8xl text-8xl md:text-gray-700 text-gray-950">
                        {driver?.abbreviation}
                    </div>

                    <div className="absolute flex gap-2 lg:top-12 lg:left-16 md:top-14 md:left-16 sm:top-4 sm:left-8 top-4 left-8 right-2">
                        <div
                            className="
                                text-gray-300 font-extrabold
                                lg:text-6xl md:text-3xl sm:text-lg text-base
                                max-w-[60vw]"
                        >
                            {driver?.permanent_number ? `${driver?.permanent_number} - ` : ''}
                            <div className="w-fit text-nowrap">{driver?.full_name}</div>
                        </div>
                    </div>

                    <div
                        className="
                        flex
                        sm:flex-col
                        md:flex-col
                        lg:flex-row
                        lg:gap-4
                        md:gap-2
                        sm:gap-1
                        gap-1
                        flex-grow
                        flex-col    
                        align-bottom
                        justify-end
                        w-full

                        absolute 
                        lg:top-32 lg:left-16 lg:right-0
                        border
                        lg:border-zinc-500
                        md:border-purple-500
                        sm:border-yellow-900
                        border-yellow-500
                        md:top-24 md:left-8 
                        sm:top-12 sm:left-6 
                        md:right-[32vw] sm:right-10
                        top-0 left-8 right-0"
                    >
                        <div className="flex flex-grow lg:flex-col md:flex-row align-bottom">
                            <p>
                                <span className="font-bold">Birth place:</span> {driver?.place_of_birth}{' '}
                                {driver?.alpha2_code}
                            </p>
                            <p className="md:leading-loose">
                                <span className="font-bold">Date of birth:</span>
                                {` ${driver?.formatted_dob}`}
                            </p>
                            <p>
                                <span className="font-bold">Total Seasons:</span> {stats?.totalSeasons}
                            </p>
                            <div>
                                <div className="ml-24 font-bold text-xl">Total Finishes by Position</div>
                                <BarChart
                                    width={600}
                                    height={200}
                                    data={driverPositionTotals}
                                    margin={{
                                        top: 25,
                                        right: 20,
                                        left: 30,
                                        bottom: 0,
                                    }}
                                >
                                    <XAxis dataKey="position_number" />
                                    <Label>Hell?</Label>
                                    <YAxis
                                        label={{
                                            angle: -90,
                                            position: 'leftCenter',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#9ca3af" />
                                </BarChart>
                            </div>
                        </div>
                    </div>
                </div>

                <div>{driver?.id && imageCallBack(/*`/assets/drivers/${year}/${driver?.id}.png`*/)}</div>
            </div>
        </PageContainer>
    );
};

export default DriverDetail;
