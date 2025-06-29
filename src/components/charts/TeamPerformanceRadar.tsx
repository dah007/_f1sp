import { ColorizedConstructorProps } from '@/routes/ConstructorStandingsRoute';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import type { TickItemTextProps } from 'recharts/types/polar/PolarAngleAxis';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

interface RadarDataProps {
    fill: string;
    team: string;
    points: number;
    position: number;
    performance: number;
}

const getCustomTick = (data: RadarDataProps[]) => {
    const CustomTick = (props: TickItemTextProps) => {
        const { payload, x, y, textAnchor } = props;
        // Defensive: fallback if x/y/textAnchor are undefined or not numbers
        if (typeof x !== 'number' || typeof y !== 'number' || !payload) {
            // Always return a valid SVG element (empty group)
            return <g />;
        }
        const team = payload.value as string;
        const teamData = data.find((d) => d.team === team);
        const color = teamData?.fill || '#fff';

        // Handle recharts' possible "inherit" value for textAnchor
        const anchor: 'start' | 'middle' | 'end' =
            textAnchor === 'start' || textAnchor === 'middle' || textAnchor === 'end' ? textAnchor : 'middle';

        return (
            <text
                x={x}
                y={y}
                textAnchor={anchor}
                fill={color}
                fontSize={14}
                dy={6}
                dx={2}
                fontVariant={'small-caps'}
                className="font-bold"
            >
                {team}
            </text>
        );
    };
    CustomTick.displayName = 'RadarCustomTick';
    return CustomTick;
};

const TeamPerformanceRadar = ({ data }: { data: ColorizedConstructorProps[] }) => {
    const radarData: RadarDataProps[] = data.map((item) => ({
        fill: item.fill,
        team: item.short_name ?? item.full_name ?? '', // Ensure team is always a string
        points: item.points,
        position: 11 - item.position_number, // Invert for radar
        performance: (item.points / data[0]?.points) * 100,
    }));

    console.log('Radar Data:', radarData);

    return (
        <>
            <h2 className="text-lg font-bold text-zinc-200 mb-2">Team Performance Radar</h2>
            <ChartContainer
                config={{ performance: { label: 'Performance % Relative to Leader' } }}
                title="Team Performance Radar"
                className="md:min-w-[40vw] md:max-w-[50vw] w-full h-fit flex flex-col bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-2xl mb-4 border border-zinc-700"
            >
                <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="team" tick={getCustomTick(radarData)} />
                    <PolarRadiusAxis domain={[0, 100]} />

                    <Radar
                        name={`Performance: `}
                        dataKey="performance"
                        stroke="#ff0000"
                        fill="rgb(240, 0, 0)"
                        fillOpacity={0.56}
                    />

                    <ChartTooltip
                        content={
                            <ChartTooltipContent className="text-zinc-300 bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700" />
                        }
                    />
                </RadarChart>
            </ChartContainer>
        </>
    );
};

TeamPerformanceRadar.displayName = 'TeamPerformanceRadar';

export default TeamPerformanceRadar;
