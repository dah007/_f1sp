import CardContainer from '@/components/CardContainer';

const WhatsNew: React.FC = (): JSX.Element => {
    return (
        <>
            <CardContainer title="What's New" className="relative flex flex-col">
                <div className="absolute top-4 right-4 text-right">
                    <button role="button" className="" onClick={() => (window.location.href = '/')}>
                        X
                    </button>
                </div>
                <div className="w-[50%]">
                    <h2 className="krona-one-regular text-lg">2025-May-25 v0.65.0</h2>

                    <ul className="w-96 text-surface dark:text-white pb-6">
                        <li className="w-full py-4">Fixed: Standings no longer a disaster on mobile</li>
                        <li className="w-full border-b-2 border-neutral-100 py-4 dark:border-white/10">
                            Fixed: Minor mobile tweaks sitewide
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="krona-one-regular text-lg">2025-May-22 v0.6.0</h2>

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
                </div>
            </CardContainer>
        </>
    );
};

export default WhatsNew;
