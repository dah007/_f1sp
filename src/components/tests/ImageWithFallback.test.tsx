import { fireEvent, render, screen } from '@testing-library/react';
import ImageWithFallback from 'components/ImageWithFallback';
import { describe, expect, it } from 'vitest';

describe('ImageWithFallback', () => {
    it('renders with the provided src', () => {
        const testSrc = 'https://example.com/image.png';
        const testAlt = 'Test image';

        render(<ImageWithFallback src={testSrc} alt={testAlt} style={{ width: '300px', height: '300px' }} />);

        const imgElement = screen.getByAltText(testAlt);
        expect(imgElement).toBeInTheDocument();
        expect(imgElement.getAttribute('src')).toBe(testSrc);
    });

    it('uses fallback when image fails to load', async () => {
        const invalidSrc = 'https://example.com/invalid.png';
        const testAlt = 'Test image';
        const placeholderSrc = 'data:image/png;base64,testPlaceholder';

        render(
            <ImageWithFallback
                src={invalidSrc}
                alt={testAlt}
                placeholder={placeholderSrc}
                style={{ width: '300px', height: '300px' }}
            />,
        );

        const imgElement = screen.getByAltText(testAlt);

        // Simulate image load error
        fireEvent.error(imgElement);

        // Check if src was changed to placeholder
        expect(imgElement.getAttribute('src')).toBe(placeholderSrc);
    });

    it('uses default placeholder when no placeholder is provided and image fails', () => {
        const invalidSrc = 'https://example.com/invalid.png';
        const testAlt = 'Test image';
        const defaultPlaceholder =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

        render(<ImageWithFallback src={invalidSrc} alt={testAlt} style={{ width: '300px', height: '300px' }} />);

        const imgElement = screen.getByAltText(testAlt);

        // Simulate image load error
        fireEvent.error(imgElement);

        // Check if src was changed to the default placeholder
        expect(imgElement.getAttribute('src')).toBe(defaultPlaceholder);
    });

    it('maintains the provided alt text after fallback', () => {
        const invalidSrc = 'https://example.com/invalid.png';
        const testAlt = 'Test image';

        render(<ImageWithFallback src={invalidSrc} alt={testAlt} style={{ width: '300px', height: '300px' }} />);

        const imgElement = screen.getByAltText(testAlt);

        // Simulate image load error
        fireEvent.error(imgElement);

        // Alt text should remain unchanged
        expect(screen.getByAltText(testAlt)).toBeInTheDocument();
    });

    // Tests for style attribute
    it('applies the provided style to the image', () => {
        const testSrc = 'https://example.com/image.png';
        const testAlt = 'Test image';
        const testStyle = { width: '400px', height: '200px', border: '1px solid red' };

        render(<ImageWithFallback src={testSrc} alt={testAlt} style={testStyle} />);

        const imgElement = screen.getByAltText(testAlt);

        expect(imgElement.style.width).toBe('400px');
        expect(imgElement.style.height).toBe('200px');
        expect(imgElement.style.border).toBe('1px solid red');
    });

    it('changes style to zero dimensions when image fails to load', () => {
        const invalidSrc = 'https://example.com/invalid.png';
        const testAlt = 'Test image';
        const initialStyle = { width: '300px', height: '300px', margin: '10px' };

        render(<ImageWithFallback src={invalidSrc} alt={testAlt} style={initialStyle} />);

        const imgElement = screen.getByAltText(testAlt);

        // Verify initial style
        expect(imgElement.style.width).toBe('300px');
        expect(imgElement.style.height).toBe('300px');
        expect(imgElement.style.margin).toBe('10px');

        // Simulate image load error
        fireEvent.error(imgElement);

        // Check if style was changed to zero dimensions
        expect(imgElement.style.width).toBe('0px');
        expect(imgElement.style.height).toBe('0px');
        // Other styles should be removed when the new style is applied
        expect(imgElement.style.margin).toBe('');
    });

    it('uses default style when none is provided', () => {
        const testSrc = 'https://example.com/image.png';
        const testAlt = 'Test image';
        const defaultStyle = { width: '300px', height: '300px' };

        // @ts-expect-error - Testing default parameter, so intentionally omitting required prop
        render(<ImageWithFallback src={testSrc} alt={testAlt} />);

        const imgElement = screen.getByAltText(testAlt);

        expect(imgElement.style.width).toBe(defaultStyle.width);
        expect(imgElement.style.height).toBe(defaultStyle.height);
    });
});
