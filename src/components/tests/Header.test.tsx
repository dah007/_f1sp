import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';

import Header from '../Header';

describe('Header component', () => {
    test('renders the header title', () => {
        render(<Header />);
        const titleElement = screen.getByText(/Base Configuration/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('renders the ModeToggle component', () => {
        render(<Header />);
        const modeToggleElement = screen.getByRole('button');
        expect(modeToggleElement).toBeInTheDocument();
    });

    test('has correct class names', () => {
        render(<Header />);
        const headerElement = screen.getByTestId('header');
        expect(headerElement).toHaveClass('text-3xl');
        expect(headerElement).toHaveClass('font-bold');
    });
});
