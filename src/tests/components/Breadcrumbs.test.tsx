import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from '../../components/Breadcrumbs';

// ? none of theses are valid, rethink, rewrite.

describe('Breadcrumbs', () => {
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
        waitFor(() => {
            return render(
                <MemoryRouter initialEntries={['/drivers']}>
                    <Routes>
                        <Route path="/drivers" element={<Breadcrumbs lastCrumb="Drivers" />} />
                    </Routes>
                </MemoryRouter>,
            );
        }).then((bob) => {
            console.log(bob.container.innerHTML);
        });
        expect(screen.getByText('Drivers')).toBeInTheDocument();
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
