import { render, screen } from '@testing-library/react';

import { expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from '../App';

test('renders "React" text', () => {
    render(<App />);
    const helloWorldElement = screen.getByText(/react/i);
    expect(helloWorldElement).toBeInTheDocument();
});
