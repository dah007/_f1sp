import Flag from '@/components/Flag';
import { useGetDriverQuery } from '@/features/driversApi';
import { Driver } from '@/types/drivers';
import { intlNumberFormat } from '@/utils/number';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
/**
 *
 * Displays detailed information about a specific Formula 1 driver.
 *
 * Fetches driver data based on the ID parameter from the URL,
 * and displays the driver's image, name, nationality flag, and career statistics
 * including wins, points, podiums, pole positions, race starts, and championship wins.
 *
 * @component
 * @returns {JSX.Element} The rendered driver detail component
 */
const DriverDetail: React.FC = () => {
    const [driver, setDriver] = useState<Driver | null>(null);
    const { id, year } = useParams<{ id: string; year: string }>();

    const { data: driverData } = useGetDriverQuery(id);

    useEffect(() => {
        if (driverData) {
            setDriver(driverData[0]);
        }
    }, [driverData]);

    if (!driver) {
        return <p className="text-lg text-gray-700">Loading...</p>;
    }

    // const imgUrl = new URL(`/assets/drivers/${year}/${driver?.id}.png`, import.meta.url).href;
    const imgUrl = `/assets/drivers/${year}/${driver?.id}.png`;

    const driverImg = document.getElementById(`driver-img-${driver?.id}`) as HTMLImageElement;
    if (driverImg) {
        driverImg.src = imgUrl || '/assets/images/404.png';
    }

    return (
        <div className="flex items-start gap-10 max-h-fit overflow-hidden">
            <div className="flex items-start justify-start">
                <img
                    id={`driver-img-${driver?.id}`}
                    src={imgUrl}
                    alt="Driver"
                    className="max-h-[175px] object-contain"
                    onError={(e) => {
                        e.currentTarget.src = '/src/assets/images/404.png';
                        e.currentTarget.onerror = null;
                    }}
                />
            </div>
            <div className="flex flex-col gap-2 relative">
                <div className="racingFont-bold text-4xl md:text-3xl z-1">
                    <Flag nameAsId={driver?.nationality_country_id} size={48} />
                    {driver?.name}
                </div>
                <div className="grid grid-cols-2 gap-10 text-sm">
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
    );
};

export default DriverDetail;
