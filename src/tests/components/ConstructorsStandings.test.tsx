import * as systemWideSlice from '@/slices/systemWideSlice';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as reduxHooks from 'app/store';
import * as standingsApi from 'features/standingsApi';
import React from 'react';
import { vi } from 'vitest';
import ConstructorStandings from '../../components/ConstructorsStandingsTable';

// Mock ScrollArea, Table, TableBody, TableCell, TableHead, TableHeader, TableRow
vi.mock('../components/ui/scroll-area', () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-area">{children}</div>,
}));
vi.mock('../components/ui/table', () => ({
    Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
    TableHead: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
}));

describe('ConstructorStandings', () => {
    const mockDispatch = vi.fn();
    // Use actual action creators for dispatch assertions
    const { setError } = systemWideSlice;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    });

    it('renders error message when no standings', () => {
        vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue(undefined);
        vi.spyOn(standingsApi, 'useGetConstructorStandingsQuery').mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
            fulfilledTimeStamp: 0,
            status: 'fulfilled',
            endpointName: 'getConstructorStandings',
            originalArgs: undefined,
            requestId: '',
            startedTimeStamp: 0,
            error: undefined,
            currentData: undefined,
        } as unknown as ReturnType<typeof standingsApi.useGetConstructorStandingsQuery>);

        render(<ConstructorStandings />);
        expect(screen.getByText(/No constructors standings available/i)).toBeInTheDocument();
    });

    it('renders table with standings data', () => {
        const standings = [
            {
                constructor_id: 'mercedes',
                position_number: 1,
                full_name: 'Mercedes',
                points: 500,
            },
            {
                constructor_id: 'redbull',
                position_number: 2,
                full_name: 'Red Bull',
                points: 450,
            },
        ];
        // Simulate Redux state update after dispatch
        let selectorValue: any = [];
        vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation(() => selectorValue);
        vi.spyOn(standingsApi, 'useGetConstructorStandingsQuery').mockReturnValue({
            data: standings,
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
            fulfilledTimeStamp: 0,
            status: 'fulfilled',
            endpointName: 'getConstructorStandings',
            originalArgs: undefined,
            requestId: '',
            startedTimeStamp: 0,
            error: undefined,
            currentData: standings,
        } as unknown as ReturnType<typeof standingsApi.useGetConstructorStandingsQuery>);

        const { rerender } = render(<ConstructorStandings />);
        // Simulate dispatching setConstructorStandings and Redux state update
        selectorValue = standings;
        rerender(<ConstructorStandings />);
        expect(screen.getByText('Mercedes')).toBeInTheDocument();
        expect(screen.getByText('Red Bull')).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
        expect(screen.getByText('450')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });

    it('dispatches setError on error', () => {
        vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue([]);
        vi.spyOn(standingsApi, 'useGetConstructorStandingsQuery').mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            isFetching: false,
            refetch: vi.fn(),
            fulfilledTimeStamp: 0,
            status: 'rejected',
            endpointName: 'getConstructorStandings',
            originalArgs: undefined,
            requestId: '',
            startedTimeStamp: 0,
            error: undefined,
            currentData: undefined,
        } as unknown as ReturnType<typeof standingsApi.useGetConstructorStandingsQuery>);

        render(<ConstructorStandings />);
        expect(mockDispatch).toHaveBeenCalledWith(setError(true));
    });
});
