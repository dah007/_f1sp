import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Flag, { FlagRendererById } from '../../components/Flag';
import { getCounty2LetterCode } from '../../utils/locations';

// Mock the country-list module
vi.mock('country-list', () => ({
    getName: vi.fn().mockImplementation((code) => {
        const countries: Record<string, string> = {
            US: 'United States',
            GB: 'United Kingdom',
            IT: 'Italy',
            DE: 'Germany',
        };
        return countries[code as keyof typeof countries] || `Country-${code}`;
    }),
    getCode: vi.fn().mockImplementation((name: string) => {
        const codes: Record<string, string> = {
            'United States': 'US',
            'United Kingdom': 'GB',
            Italy: 'IT',
            Germany: 'DE',
        };
        return name in codes ? codes[name as keyof typeof codes] : null;
    }),
}));

// Mock the locations util
vi.mock('../../utils/locations', () => ({
    getCounty2LetterCode: vi.fn().mockImplementation((country) => {
        if (country === 'united-kingdom') return 'GB';
        if (country === 'germany') return 'DE';
        if (country === 'italy') return 'IT';
        return 'US'; // Default for testing
    }),
}));

describe('Flag Component', () => {
    it('renders properly with country code', () => {
        render(<Flag cCode="US" />);
        const img = screen.getByRole('img');

        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/US/shiny/64.png');
        expect(img).toHaveAttribute('alt', 'United States');
    });

    it('renders properly with nameAsId', () => {
        render(<Flag nameAsId="germany" />);

        // Verify getCounty2LetterCode was called with the correct argument
        expect(getCounty2LetterCode).toHaveBeenCalledWith('germany');

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/DE/shiny/64.png');
        expect(img).toHaveAttribute('alt', 'Germany'); // From our mocked getName
    });

    it('renders properly with name', () => {
        render(<Flag name="IT" />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/IT/shiny/64.png');
        expect(img).toHaveAttribute('alt', 'IT');
    });

    it('renders with custom size', () => {
        render(<Flag cCode="US" size={32} />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/US/shiny/32.png');
    });

    it('applies size classes when sizes prop is provided', () => {
        const sizes = {
            base: 'w-8',
            md: 'md:w-12',
            lg: 'lg:w-16',
        };

        render(<Flag cCode="US" sizes={sizes} />);

        const img = screen.getByRole('img');
        expect(img).toHaveClass('w-8');
        expect(img).toHaveClass('md:w-12');
        expect(img).toHaveClass('lg:w-16');
    });

    it('returns empty fragment when no identifiers are provided', () => {
        const { container } = render(<Flag />);
        expect(container.firstChild).toBeNull();
    });

    it('prioritizes nameAsId, cCode, and name', () => {
        render(<Flag cCode="US" nameAsId="germany" name="IT" />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/DE/shiny/64.png');
    });

    it('prioritizes nameAsId over name', () => {
        render(<Flag nameAsId="germany" name="IT" />);

        expect(getCounty2LetterCode).toHaveBeenCalledWith('germany');
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/DE/shiny/64.png');
    });
});

describe('FlagRendererById Component', () => {
    it('renders Flag component with correct props', () => {
        render(<FlagRendererById countryId="germany" />);

        // The Flag component should be called with nameAsId="germany" and size=32
        expect(getCounty2LetterCode).toHaveBeenCalledWith('germany');

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/DE/shiny/32.png');
    });

    it('uses default size of 32', () => {
        render(<FlagRendererById countryId="germany" />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/DE/shiny/32.png');
    });

    it('allows custom size', () => {
        render(<FlagRendererById countryId="germany" size={48} />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://flagsapi.com/DE/shiny/48.png');
    });
});
