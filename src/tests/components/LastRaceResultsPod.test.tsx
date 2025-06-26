import { render, screen } from '@testing-library/react';
import LastRaceResultsPod from 'components/LastRaceResultsPod';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('../CardSkeleton', () => ({
    default: () => <div data-testid="card-skeleton" />,
}));
vi.mock('../ui/scroll-area', () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-area">{children}</div>,
}));
vi.mock('../ui/table', () => ({
    Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
    TableHead: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
}));

// Mock hooks and slices - use vi.hoisted to ensure they're available during hoisting
const { mockUseAppSelector, mockUseGetLastRaceResultsQuery, mockUseAppDispatch } = vi.hoisted(() => ({
    mockUseAppSelector: vi.fn(),
    mockUseGetLastRaceResultsQuery: vi.fn(),
    mockUseAppDispatch: vi.fn(),
}));

vi.mock('@/app/store', async () => {
    const actual = await vi.importActual<any>('@/app/store');
    return {
        ...actual,
        useAppDispatch: () => mockUseAppDispatch,
        useAppSelector: mockUseAppSelector,
    };
});
vi.mock('@/features/raceApi', () => ({
    raceApi: {
        reducer: (state = {}) => state, // Return the state as-is
        reducerPath: 'raceApi',
        middleware: () => (next: any) => (action: any) => next(action), // Valid middleware function
        endpoints: {},
    },
    useGetLastRaceResultsQuery: mockUseGetLastRaceResultsQuery,
}));
vi.mock('@/slices/racesSlice', () => ({
    default: (state = {}) => state, // default export for the reducer
    setLastRaceResults: vi.fn(),
}));
vi.mock('@/slices/systemWideSlice', () => ({
    default: (state = {}) => state, // default export for the reducer
    setError: vi.fn(),
    setLoading: vi.fn(),
}));

const mockStore = configureStore([]);
const defaultState = {
    races: {
        lastRaceResults: [
            {
                position_text: '1',
                driver_name: 'Max Verstappen',
                gap: '+0.000s',
                points: 25,
                permanent_number: '33',
                id: '1',
            },
            {
                position_text: '2',
                driver_name: 'Lewis Hamilton',
                gap: '+5.000s',
                points: 18,
                permanent_number: '44',
                id: '2',
            },
        ],
        raceNext: { id: '5' },
    },
    systemWide: {},
};

describe('LastRaceResultsPod', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore(defaultState);
        mockUseAppSelector.mockImplementation((fn: any) => fn(defaultState));
        vi.clearAllMocks();
    });

    it('renders CardSkeleton when loading', () => {
        mockUseGetLastRaceResultsQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });
        render(
            <Provider store={store}>
                <LastRaceResultsPod />
            </Provider>,
        );
        expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    it('renders table with race results', () => {
        mockUseGetLastRaceResultsQuery.mockReturnValue({
            data: defaultState.races.lastRaceResults,
            isLoading: false,
            isError: false,
        });
        render(
            <Provider store={store}>
                <LastRaceResultsPod />
            </Provider>,
        );
        expect(screen.getByText('Max Verstappen')).toBeInTheDocument();
        expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
        expect(screen.getByText('Pos')).toBeInTheDocument();
        expect(screen.getByText('Gap')).toBeInTheDocument();
        expect(screen.getByText('Points')).toBeInTheDocument();
    });

    it('renders "No data available" when raceResults is empty', () => {
        mockUseAppSelector.mockImplementation((fn: any) =>
            fn({
                ...defaultState,
                races: { ...defaultState.races, lastRaceResults: [] },
            }),
        );
        mockUseGetLastRaceResultsQuery.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        });
        render(
            <Provider store={store}>
                <LastRaceResultsPod />
            </Provider>,
        );
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders nothing if raceResults is not an array', () => {
        mockUseAppSelector.mockImplementation((fn: any) =>
            fn({
                ...defaultState,
                races: { ...defaultState.races, lastRaceResults: null },
            }),
        );
        mockUseGetLastRaceResultsQuery.mockReturnValue({
            data: null,
            isLoading: false,
            isError: false,
        });
        render(
            <Provider store={store}>
                <LastRaceResultsPod />
            </Provider>,
        );
        // Should not throw and should render the skeleton (since !dataResults)
        expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    it('dispatches setError when there is an error', () => {
        mockUseGetLastRaceResultsQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });
        render(
            <Provider store={store}>
                <LastRaceResultsPod />
            </Provider>,
        );
        expect(mockUseAppDispatch).toHaveBeenCalled();
    });
});
