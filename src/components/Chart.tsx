import React from 'react';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'components/ui/chart';

interface ChartProps {
    className?: string;
    config?: ChartConfig;
    data?: Record<string, number>[];
    axisDataKey?: string;
    description?: string;
    layout?: 'vertical' | 'horizontal';
    minValue?: number;
    maxValue?: number;
    title?: string;
    yAxis?: string;
    xAxis?: string;
}

const Chart: React.FC<ChartProps> = ({
    className = '',
    config = {} as ChartConfig,
    data,
    layout = 'horizontal',
    maxValue = 100,
    minValue = 0,
    xAxis,
    yAxis,
}) => {
    return (
        <ChartContainer config={config} className={`min-h-[13vh] w-full ${className}`}>
            <BarChart accessibilityLayer data={data} layout={layout} margin={{ top: 0 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                    dataKey={yAxis}
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => (value && value?.slice ? value?.slice(0, 3) : 0)}
                    hide
                />
                <XAxis dataKey={xAxis} type="number" hide domain={[minValue, maxValue]} />

                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

                <Bar dataKey={xAxis ?? 0} layout={layout} className="rounded-md" fill="#2563eb" radius={6}>
                    <LabelList
                        dataKey={yAxis}
                        position="insideLeft"
                        fill="#fafaec"
                        offset={8}
                        className="m-9"
                        fontSize={12}
                    />
                    <LabelList dataKey={xAxis} position="insideRight" offset={8} fill="#fafaec" fontSize={12} />
                </Bar>
            </BarChart>
        </ChartContainer>
    );
};

export default Chart;
