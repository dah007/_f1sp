import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from '../components/Breadcrumbs';

// ? none of theses are valid, rethink, rewrite.

describe.skip('Breadcrumbs', () => {
    it('renders Home as the first breadcrumb', () => {
        render(
            <MemoryRouter initialEntries={['/drivers']}>
                <Routes>
                    <Route path="/drivers" element={<Breadcrumbs />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders correct breadcrumb for a known MENU path', async () => {
        render(
            <MemoryRouter initialEntries={['/drivers']}>
                <Routes>
                    <Route path="/drivers" element={<Breadcrumbs />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Drivers')).toBeInTheDocument();
    });

    it('renders lastCrumb if id param matches', () => {
        render(
            <MemoryRouter initialEntries={['/drivers/44']}>
                <Routes>
                    <Route path="/drivers/:id" element={<Breadcrumbs lastCrumb="Lewis Hamilton" />} />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Lewis Hamilton')).toBeInTheDocument();
    });

    it('hides hidden MENU items', () => {
        render(
            <MemoryRouter initialEntries={['/driver']}>
                <Routes>
                    <Route path="/driver" element={<Breadcrumbs />} />
                </Routes>
            </MemoryRouter>,
        );
        // 'Driver' is hidden in MENU, so should not be visible
        expect(screen.queryByText('Driver')).not.toBeInTheDocument();
    });
});
