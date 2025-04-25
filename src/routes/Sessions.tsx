import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { useGetPointsByRaceQuery } from 'features/f1spRacesApi';
import { useEffect, useState } from 'react';

// localStorage.setItem(
//     'currentRoute',
//     JSON.stringify({
//         label: 'Sessions',
//         path: `/sessions`,
//     }),
// );

interface IDriverPoint {
    raceId: number;
    full_name: string;
    points: number;
    short_name: string;
}

interface ISeries {
    driver: string;
    data: { category: string; value: number }[];
}

const Sessions: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { data: sessionsData } = useGetPointsByRaceQuery(selectedYear);
    const [drivers, setDrivers] = useState<string[]>();
    const [distinctRaceIds, setDistinctRaceIds] = useState<number[]>();
    const [chartData, setChartData] = useState<ISeries[]>([]);

    useEffect(() => {
        if (!sessionsData) return;
        setDistinctRaceIds([
            ...new Set((sessionsData as IDriverPoint[]).map((session: IDriverPoint) => session.raceId)),
        ]);
        setDrivers([...new Set((sessionsData as IDriverPoint[]).map((session: IDriverPoint) => session.full_name))]);
    }, [sessionsData]);

    useEffect(() => {
        if (!drivers || !distinctRaceIds) return;

        const cData: ISeries[] = [];

        drivers.forEach((driver) => {
            const tempDataPoint: ISeries = {
                driver,
                data: [],
            };

            distinctRaceIds.forEach((raceId) => {
                const driverRaceData = sessionsData?.find(
                    (session: IDriverPoint) => session.raceId === raceId && session.full_name === driver,
                );

                tempDataPoint.data.push({
                    category: driverRaceData?.short_name,
                    value: driverRaceData?.points || 0,
                });
            });
            cData.push(tempDataPoint);
        });
        setChartData(cData);
    }, [drivers, distinctRaceIds, sessionsData]);

    const yearsDropdown = () => {
        let year = 1950;
        const returnYears = [];
        while (year <= currentYear) {
            returnYears.push(
                <option key={year} value={year}>
                    {year}
                </option>,
            );
            year++;
        }
        return returnYears;
    };

    return (
        <div className="w-full h-full bg-gray-400">
            <div className="mb-4 text-center">
                <select
                    className="select select-bordered"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                    {yearsDropdown()}
                </select>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-center">Driver Points Progression</h2>
            <LineChart
                width={1000}
                height={500}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="value" />
                <Tooltip />
                <Legend />
                {chartData?.map((cd) => <Line dataKey="value" data={cd.data} name={cd.driver} key={cd.driver} />)}
            </LineChart>
        </div>
    );
};

export default Sessions;
