import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';

import Footer from '../ui/Footer';

describe('Footer component', () => {
    test('renders the footer text correctly', () => {
        render(<Footer />);
        const footerText = screen.getByText(
            /Built with ❤️ using Vite with React, React Router, Redux Query, TailwindCSS & shadcn\/ui/i,
        );
        expect(footerText).toBeInTheDocument();
    });
});
