import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CardSkeleton from '../../components/CardSkeleton';

describe('CardSkeleton', () => {
    it('renders skeleton when visible is true (default)', () => {
        const { container } = render(<CardSkeleton />);
        expect(container.querySelectorAll('.animate-pulse')).toHaveLength(1);
        expect(container.querySelectorAll('.h-4.bg-gray-300.rounded')).toHaveLength(3);
    });

    it('renders skeleton with custom className', () => {
        const { container } = render(<CardSkeleton className="my-custom-class" />);
        expect(container.querySelector('.my-custom-class')).not.toBeNull();
    });

    it('renders nothing when visible is false', () => {
        const { container } = render(<CardSkeleton visible={false} />);
        expect(container.firstChild).toBeNull();
    });
});
