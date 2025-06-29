import React, { useState } from 'react';

/**
 * Renders an image with a fallback placeholder.
 * If the original image fails to load, it automatically switches to the placeholder image
 * and adjusts the style to hide the placeholder (sets dimensions to 0).
 *
 * @param props - The component props
 * @param props.alt - Alternative text for the image for accessibility
 * @param props.placeholder - Base64 or URL of fallback image to display when the main image fails to load
 * @param props.src - URL of the primary image to display
 * @param props.style - CSS properties to apply to the image element
 * @returns A React image element with fallback handling
 */
const ImageWithFallback = ({
    alt,
    placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC',
    src,
    style = { width: '300px', height: '300px' },
}: {
    alt: string;
    placeholder?: string;
    src: string;
    style?: React.CSSProperties;
}) => {
    const [imgSrc, setImgSrc] = useState<string>(src);
    const [imgStyle, setImgStyle] = useState<React.CSSProperties>(style);

    return (
        <img
            src={imgSrc}
            alt={alt}
            onError={() => {
                setImgSrc(placeholder);
                setImgStyle({ width: '0px', height: '0px' });
            }}
            style={imgStyle}
        />
    );
};

export default ImageWithFallback;
