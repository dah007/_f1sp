import { useEffect, useState } from 'react';

const StaticPage = ({ page }: { page: string }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(`/assets/static/${page}.html`)
            .then((res) => res.text())
            .then((html) => setContent(html));
    }, [page]);

    useEffect(() => {
        console.log('StaticPage content:', content);
    }, [content]);

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default StaticPage;
