import CardContainer from '@/components/CardContainer';

const WhatsNew: React.FC = (): JSX.Element => {
    return (
        <>
            <CardContainer title="What's New" className="relative">
                <div className="absolute top-4 right-4 text-right">
                    <button role="button" className="" onClick={() => (window.location.href = '/')}>
                        X
                    </button>
                </div>
                <ul className="w-96 text-surface dark:text-white">
                    <li className="w-full py-4">Fixed: Circuits map more mobile friendly</li>
                    <li className="w-full border-b-2 border-neutral-100 py-4 dark:border-white/10">
                        Fixed: Driver images not loading
                    </li>
                    <li className="w-full border-b-2 border-neutral-100 py-4 dark:border-white/10">
                        Fixed: Driver detail being cut off
                    </li>
                    <li className="w-full border-b-2 border-neutral-100 py-4 dark:border-white/10">
                        Added: What&apos;s New route
                    </li>
                    <li className="w-full border-b-2 border-neutral-100 py-4 dark:border-white/10">
                        Added: First step of SEO
                    </li>
                </ul>
            </CardContainer>
        </>
    );
};

export default WhatsNew;
