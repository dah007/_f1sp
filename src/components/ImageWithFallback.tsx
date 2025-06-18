import React, { useState } from 'react';

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
