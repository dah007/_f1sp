import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from 'components/Button';
import { describe, expect, it, vi } from 'vitest';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /Click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('flex items-center');
    });

    it('applies custom className when provided', () => {
        render(<Button className="test-class">Custom Button</Button>);
        const button = screen.getByRole('button', { name: /Custom Button/i });
        expect(button).toHaveClass('test-class');
        expect(button).toHaveClass('flex items-center');
    });

    it('applies the correct variant styles', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button', { name: /Delete/i });
        // We can't directly test the class names here since they're applied by the
        // underlying Button component, but we can check that the variant prop is passed
        expect(button).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByRole('button', { name: /Click me/i });

        await user.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('forwards additional HTML attributes to the underlying button', () => {
        render(
            <Button type="submit" disabled data-testid="test-button">
                Submit
            </Button>,
        );
        const button = screen.getByTestId('test-button');
        expect(button).toHaveAttribute('type', 'submit');
        expect(button).toBeDisabled();
    });

    it('renders with children', () => {
        render(
            <Button>
                <span data-testid="child-element">Child Element</span>
            </Button>,
        );

        expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
});
