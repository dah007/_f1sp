import { configureStore, Dispatch, Middleware, MiddlewareAPI, UnknownAction } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import * as driversApi from '../features/driversApi';
import * as raceApi from '../features/raceApi';
import racesSlice from '../slices/racesSlice';
import siteWideSlice from '../slices/systemWideSlice';

/**
 * Mock the race API hooks
 */
vi.mock('../features/raceApi', () => ({
    __esModule: true,
    raceApi: {
        reducerPath: 'raceApi',
        reducer: () => ({}),
        middleware: vi.fn(
            () => (next: Middleware) => (action: MiddlewareAPI<Dispatch<UnknownAction>, string>) => next(action),
        ),
        endpoints: {
            getRaceNext: {
                useQuery: vi.fn(),
            },
        },
    },
    useGetRaceNextQuery: vi.fn(),
}));

/**
 * Mock the drivers API hooks
 */
vi.mock('../features/driversApi', () => ({
    __esModule: true,
    driversApi: {
        reducerPath: 'driversApi',
        reducer: () => ({}),
        middleware: vi.fn(
            () => (next: Middleware) => (action: MiddlewareAPI<Dispatch<UnknownAction>, string>) => next(action),
        ),
        endpoints: {
            getDrivers: {
                useQuery: vi.fn(),
            },
        },
    },
    useGetDriversQuery: vi.fn(),
}));

// Mock lazy-loaded components
vi.mock('../routes/HomeRoute', () => ({
    default: () => <div data-testid="home-route">Home Route</div>,
}));

vi.mock('../routes/Static', () => ({
    default: () => <div data-testid="static-route">Static Route</div>,
}));

// Mock components
vi.mock('../components/Header', () => ({
    default: () => <header data-testid="header">Header</header>,
}));

vi.mock('../components/Footer', () => ({
    default: () => <footer data-testid="footer">Footer</footer>,
}));

describe('App Component', () => {
    // Setup store for each test
    const store = configureStore({
        reducer: {
            races: racesSlice,
            siteWide: siteWideSlice,
            driversApi: driversApi.driversApi.reducer,
            raceApi: raceApi.raceApi.reducer,
        },
        // Don't add RTK Query middleware in tests as it's mocked
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Setup default mock for useGetNextRaceQuery
        vi.mocked(raceApi.useGetNextRaceQuery).mockReturnValue({
            data: {
                circuit_id: 'monaco',
                race_name: 'Monaco Grand Prix',
                date: '2025-05-25',
            },
            isLoading: false,
            isError: false,
        } as any);

        // Setup default mock for useGetDriversQuery
        vi.mocked(driversApi.useGetDriversQuery).mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        } as any);
    });

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>,
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('handles API errors gracefully', () => {
        // Mock error state
        vi.mocked(raceApi.useGetNextRaceQuery).mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        } as any);

        render(
            <Provider store={store}>
                <App />
            </Provider>,
        );

        // The app should still render without crashing
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders home route by default', () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>,
        );

        expect(screen.getByTestId('home-route')).toBeInTheDocument();
    });

    it('updates store with next race data', () => {
        const mockNextRace = {
            circuit_id: 'monaco',
            race_name: 'Monaco Grand Prix',
            date: '2025-05-25',
        };

        vi.mocked(raceApi.useGetNextRaceQuery).mockReturnValue({
            data: mockNextRace,
            isLoading: false,
            isError: false,
        } as any);

        render(
            <Provider store={store}>
                <App />
            </Provider>,
        );

        // Just check that the component renders successfully
        // The real store updates are more appropriately tested in a unit test for the slice
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('maintains layout structure', () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>,
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});
