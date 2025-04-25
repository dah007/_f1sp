import React from 'react';

type ITitleProps = {
    title: string;
    type?: string;
};
/**
 * Renders a title based on the provided type.
 *
 * @param {ITitleProps} props - The properties for the Titles component.
 * @param {string} props.title - The title text to be displayed.
 * @param {string} [props.type='pod'] - The type of title to render. h1 | inline | pod.
 *
 * @returns {JSX.Element} The rendered title element.
 */
const Titles: React.FC<ITitleProps> = ({ title, type = 'pod' }: ITitleProps): JSX.Element => {
    const renderTitle = () => {
        if (type === 'h1')
            return (
                <h1 className="text-3xl font-extrabold tracking-wider racingFont" data-testid="titlesTitle">
                    {title}
                </h1>
            );

        if (type === 'pod')
            return (
                <div className="text-lg font-extrabold podTitle" data-testid="titlesTitle">
                    {title}
                </div>
            );
    };

    return <>{renderTitle()}</>;
};

export default Titles;
