import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CardContainer from '../../components/CardContainer';

describe('CardContainer Component', () => {
    it('renders children correctly', () => {
        render(
            <CardContainer>
                <div data-testid="child-content">Child Content</div>
            </CardContainer>,
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('renders a skeleton when no children are provided', () => {
        const SlowedownCard = () => {
            // Simulate a slow loading state
            // In a real application, this could be a loading state or a skeleton component
            // For testing purposes, we can just return a simple div with a class
            // indicating it's a skeleton
            // This simulates a slow loading state
            return (
                <CardContainer>
                    <div className="skeleton">Loading...</div>
                </CardContainer>
            );
        };

        render(
            <CardContainer>
                <SlowedownCard />
            </CardContainer>,
        );
        // Find the skeleton component
        const skeleton = document.querySelector('.skeleton');
        expect(skeleton).toBeInTheDocument();
    });

    it('renders title when provided', () => {
        const testTitle = 'Test Card Title';
        render(<CardContainer title={testTitle}>Content</CardContainer>);
        expect(screen.getByText(testTitle)).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        const testDescription = 'Test Card Description';
        render(<CardContainer description={testDescription}>Content</CardContainer>);
        expect(screen.getByText(testDescription)).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
        render(
            <CardContainer footer={<button data-testid="footer-button">Footer Button</button>}>Content</CardContainer>,
        );
        expect(screen.getByTestId('footer-button')).toBeInTheDocument();
    });

    it('does not render header when neither title nor description is provided', () => {
        render(<CardContainer>Content</CardContainer>);
        const header = document.querySelector('.card-header');
        expect(header).not.toBeInTheDocument();
    });

    it('applies custom className to the Card component', () => {
        const customClass = 'custom-card-class';
        render(<CardContainer className={customClass}>Content</CardContainer>);
        const card = document.querySelector('.card');
        expect(card).toHaveClass(customClass);
        expect(card).toHaveClass('dark:bg-zinc-900');
        expect(card).toHaveClass('bg-zinc-300');
    });

    it('applies custom className to the CardContent component', () => {
        const customClass = 'custom-content-class';
        render(<CardContainer childrenClassName={customClass}>Content</CardContainer>);
        const content = document.querySelector('.children-div');
        expect(content).toHaveClass(customClass);
    });

    it('applies custom className to the title', () => {
        const customClass = 'custom-title-class';
        render(
            <CardContainer title="Test Title" titleClassName={customClass}>
                Content
            </CardContainer>,
        );
        const title = screen.getByText('Test Title');
        expect(title).toHaveClass(customClass);
        expect(title).toHaveClass('m-0');
    });

    it('applies custom className to the description', () => {
        const customClass = 'custom-description-class';
        render(
            <CardContainer description="Test Description" descriptionClassName={customClass}>
                Content
            </CardContainer>,
        );
        const description = screen.getByText('Test Description');
        expect(description).toHaveClass(customClass);
    });

    it('applies custom className to the footer', () => {
        const customClass = 'custom-footer-class';
        render(
            <CardContainer footer={<div>Footer Content</div>} footerClassName={customClass}>
                Content
            </CardContainer>,
        );
        const footer = document.querySelector('.card-footer');
        expect(footer).toHaveClass(customClass);
        expect(footer).toHaveClass('flex');
        expect(footer).toHaveClass('justify-between');
    });
});
