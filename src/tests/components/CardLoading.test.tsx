import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CardLoading from '../../components/CardLoading';

describe('CardLoading', () => {
    it('renders loading overlay when isLoading is true', () => {
        render(<CardLoading isLoading={true} />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(document.querySelector('.loader')).not.toBeNull();
        expect(document.querySelector('.absolute.w-full')).not.toBeNull();
    });

    it('renders nothing when isLoading is false', () => {
        const { container } = render(<CardLoading isLoading={false} />);
        expect(container.firstChild).toBeNull();
        expect(screen.queryByText('Loading')).toBeNull();
    });
});
