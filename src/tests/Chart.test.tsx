import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Chart from '../components/Chart';

vi.mock('recharts', () => ({
    Bar: ({ children }: any) => <div data-testid="Bar">{children}</div>,
    BarChart: ({ children }: any) => <div data-testid="BarChart">{children}</div>,
    CartesianGrid: () => <div data-testid="CartesianGrid" />,
    LabelList: (props: any) => <div data-testid="LabelList" {...props} />,
    XAxis: (props: any) => <div data-testid="XAxis" {...props} />,
    YAxis: (props: any) => <div data-testid="YAxis" {...props} />,
}));

vi.mock('../components/ui/chart', () => ({
    ChartContainer: ({ children, className }: any) => (
        <div data-testid="ChartContainer" className={className}>
            {children}
        </div>
    ),
    ChartTooltip: () => <div data-testid="ChartTooltip" />,
    ChartTooltipContent: () => <div data-testid="ChartTooltipContent" />,
}));

describe('Chart', () => {
    it('renders ChartContainer and BarChart', () => {
        render(<Chart data={[]} xAxis="x" yAxis="y" />);
        expect(screen.getByTestId('ChartContainer')).toBeInTheDocument();
        expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });

    it('renders axis and bar elements', () => {
        render(<Chart data={[]} xAxis="x" yAxis="y" />);
        expect(screen.getByTestId('XAxis')).toBeInTheDocument();
        expect(screen.getByTestId('YAxis')).toBeInTheDocument();
        expect(screen.getAllByTestId('LabelList').length).toBeGreaterThanOrEqual(2);
        expect(screen.getByTestId('Bar')).toBeInTheDocument();
    });

    it('passes className to ChartContainer', () => {
        render(<Chart className="my-class" data={[]} xAxis="x" yAxis="y" />);
        const container = screen.getByTestId('ChartContainer');
        expect(container.className).toContain('my-class');
    });
});
