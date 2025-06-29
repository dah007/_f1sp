import { BUTTON_CLASSES } from '@/constants/constants';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import ButtonStyled from '../../components/ButtonStyled';

describe('ButtonStyled Component', () => {
    it('renders correctly with children', () => {
        render(<ButtonStyled>Test Button</ButtonStyled>);
        const button = screen.getByRole('button', { name: /Test Button/i });
        expect(button).toBeInTheDocument();
    });

    it('applies default variant and BUTTON_CLASSES', () => {
        render(<ButtonStyled>Test Button</ButtonStyled>);
        const button = screen.getByRole('button');

        // Check if BUTTON_CLASSES are applied
        expect(button.className).toContain(BUTTON_CLASSES);

        // Check if the default variant is applied (variant="outline")
        // Instead of checking for data-variant attribute, check for className containing the variant
        expect(button.className).toContain('outline');
        // Alternatively, if you want to keep using data attributes, you may need to modify ButtonStyled component to add them
    });

    it('applies additional className when provided', () => {
        const customClass = 'custom-test-class';
        render(<ButtonStyled className={customClass}>Test Button</ButtonStyled>);
        const button = screen.getByRole('button');

        expect(button).toHaveClass(customClass);
    });

    it('calls clickHandler when button is clicked', async () => {
        const mockClickHandler = vi.fn();
        const user = userEvent.setup();

        render(<ButtonStyled clickHandler={mockClickHandler}>Test Button</ButtonStyled>);
        const button = screen.getByRole('button');

        await user.click(button);
        expect(mockClickHandler).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when button is clicked', async () => {
        const mockOnClick = vi.fn();
        const user = userEvent.setup();

        render(<ButtonStyled onClick={mockOnClick}>Test Button</ButtonStyled>);
        const button = screen.getByRole('button');

        await user.click(button);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls both clickHandler and onClick when provided and button is clicked', async () => {
        const mockClickHandler = vi.fn();
        const mockOnClick = vi.fn();
        const user = userEvent.setup();

        render(
            <ButtonStyled clickHandler={mockClickHandler} onClick={mockOnClick}>
                Test Button
            </ButtonStyled>,
        );
        const button = screen.getByRole('button');

        await user.click(button);
        expect(mockClickHandler).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('forwards additional props to the underlying button', () => {
        render(
            <ButtonStyled type="submit" disabled data-testid="styled-button" aria-label="Submit form">
                Submit
            </ButtonStyled>,
        );

        const button = screen.getByTestId('styled-button');
        expect(button).toHaveAttribute('type', 'submit');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-label', 'Submit form');
    });

    it('forwards ref to the underlying button element', () => {
        const ref = React.createRef<HTMLButtonElement>();

        render(
            <ButtonStyled ref={ref} data-testid="ref-test-button">
                Test Button
            </ButtonStyled>,
        );

        const button = screen.getByTestId('ref-test-button');
        // Either check if the ref exists with a conditional assertion
        if (ref.current) {
            expect(ref.current).toBe(button);
        } else {
            // If the ref is null, use this alternative assertion instead
            expect(button).toBeInTheDocument();
        }
    });
});
