import Flag from '@/components/Flag';
import PageContainer from '@/components/PageContainer';
import { useGetDriverQuery } from '@/features/driversApi';
import { Driver } from '@/types/drivers';
import { intlNumberFormat } from '@/utils/number';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DriverDetail: React.FC = () => {
    const [driver, setDriver] = useState<Driver | null>(null);
    const { id, year } = useParams<{ id: string; year: string }>();

    console.log('DriverDetail', id, year);

    const { data: driverData } = useGetDriverQuery(id);

    useEffect(() => {
        if (driverData) {
            console.log('driver', driverData[0]);
            setDriver(driverData[0]);
        }
    }, [driverData]);

    if (!driver) {
        return <p className="text-lg text-gray-700">Loading...</p>;
    }

    return (
        <PageContainer lastCrumb={driver?.name} title={``}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="w-[48vw] flex items-baseline">
                    <div className="flex flex-col gap-2 relative">
                        <div className="racingFont-bold text-7xl md:text-5xl z-1">
                            <Flag nameAsId={driver?.nationality_country_id} size={64} />
                            {driver?.name}
                        </div>
                        <div className="flex flex-col-1 md:flex-col-2 gap-4 text-lg">
                            <div>
                                <div>Total Wins: {driver?.total_race_wins}</div>
                                <div>Total Points: {intlNumberFormat(driver?.total_points)}</div>
                                <div>Total Race Laps: {intlNumberFormat(driver?.total_race_laps)}</div>
                                <div>Total Championship Wins: {driver?.total_championship_wins}</div>
                            </div>

                            <div>
                                <div>Total Podiums: {driver?.total_podiums}</div>
                                <div>Total Pole Positions: {driver?.total_pole_positions}</div>
                                <div>Total Race Starts: {driver?.total_race_starts}</div>
                                <div>Total Fastest Laps: {driver?.total_fastest_laps}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-end">
                    <img
                        src={`/src/assets/drivers/${year}/${driver?.id}.png`}
                        alt="Driver"
                        className="max-w-[100vw] md:max-w-[40vw] z-0 mb-10"
                    />
                </div>
            </div>
        </PageContainer>
    );
};

export default DriverDetail;
