import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, expect, test, vi } from 'vitest';
import DriverDetail from '../DriverDetailRoute';

// Mock the API call
vi.mock('../../api/drivers', () => ({
    getDriverById: vi.fn().mockImplementation((id: string) => {
        if (id === '1') {
            return Promise.resolve({
                id: '1',
                name: 'Lewis Hamilton',
                team: 'Mercedes',
                number: 44,
                championships: 7,
                country: 'United Kingdom',
                podiums: 195,
                points: 4553.5,
                image: 'hamilton.jpg',
            });
        }
        return Promise.reject(new Error('Driver not found'));
    }),
}));

describe('DriverDetail Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders loading state initially', () => {
        render(
            <MemoryRouter initialEntries={['/drivers/1']}>
                <Routes>
                    <Route path="/drivers/:id" element={<DriverDetail />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders driver details after data is loaded', async () => {
        render(
            <MemoryRouter initialEntries={['/drivers/1']}>
                <Routes>
                    <Route path="/drivers/:id" element={<DriverDetail />} />
                </Routes>
            </MemoryRouter>,
        );

        // Wait for the driver data to load
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });

        // Check if driver details are rendered correctly
        expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
        expect(screen.getByText('Mercedes')).toBeInTheDocument();
        expect(screen.getByText('44')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
        expect(screen.getByText('195')).toBeInTheDocument();
        expect(screen.getByText('4553.5')).toBeInTheDocument();
        expect(screen.getByAltText('Lewis Hamilton')).toHaveAttribute('src', 'hamilton.jpg');
    });

    test('renders error message when driver is not found', async () => {
        render(
            <MemoryRouter initialEntries={['/drivers/999']}>
                <Routes>
                    <Route path="/drivers/:id" element={<DriverDetail />} />
                </Routes>
            </MemoryRouter>,
        );

        // Wait for the error state
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText(/error/i)).toBeInTheDocument();
        expect(screen.getByText(/driver not found/i)).toBeInTheDocument();
    });
});
