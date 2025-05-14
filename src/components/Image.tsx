import { useState } from 'react';

const Image = ({ inView, ...imageProps }: { inView: boolean }) => {
    const [status, setStatus] = useState('loading');

    return (
        <>
            {status === 'loading' && <div>loading...</div>}
            {inView && <img {...imageProps} onLoad={() => setStatus('loaded')} onError={() => setStatus('failed')} />}
            {status === 'failed' && <div>error</div>}
        </>
    );
};

export default Image;
