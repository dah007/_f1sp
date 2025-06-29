import { DriverStanding } from '@/types/standings';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

const PointsAccumulationChart: React.FC<{ data: DriverStanding[] }> = ({ data }) => {
    const areaData = data.map((item, index) => ({
        position: index + 1,
        points: item.points,
        driver: item.name,
    }));

    return (
        <ChartContainer config={{ points: { label: 'Points', color: 'hsl(var(--chart-1))' } }}>
            <AreaChart data={areaData}>
                <XAxis dataKey="position" />
                <YAxis />
                <Area
                    type="monotone"
                    dataKey="points"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.4}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
            </AreaChart>
        </ChartContainer>
    );
};

export default PointsAccumulationChart;
