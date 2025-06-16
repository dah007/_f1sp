import { LucideCoffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { constructorMenuItems, driverMenuItems, MenuButton, raceMenuItems } from './Header';
import dah007Logo from '/assets/dah007-icon-logo.svg';

const Footer = () => {
    const navigate = useNavigate();
    const handleNavigationMobile = (path: string) => {
        navigate(path);
    };

    return (
        <footer className="bg-zinc-300 dark:bg-zinc-900 border-t-2 border-zinc-700 mt-16">
            <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 pt-8 sm:px-6 lg:space-y-2 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <a href="#" className="text-2xl font-bold">
                            <span className="ferrari-text">F1</span>
                            <span className="mclaren-text">{'//'}</span>
                            <span className="mercedes-text">sp</span>
                        </a>
                    </div>

                    <ul className="mt-8 flex justify-start gap-6 sm:mt-0 sm:justify-end">
                        <li className="text-nowrap">
                            <a
                                href="https://buymeacoffee.com/dah007"
                                rel="noreferrer"
                                target="_blank"
                                title="Buy me a coffee"
                            >
                                <LucideCoffee className="text-yellow-400 light:text-brown-500" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="http://www.github.com/dah007/_f1sp"
                                rel="noreferrer"
                                target="_blank"
                                className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                            >
                                <span className="sr-only">GitHub</span>

                                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 mt-8 gap-8 border-t border-gray-100 pt-0 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16 dark:border-zinc-300 pb-8">
                    <div>
                        {/* LEFT */}
                        <p className="font-medium text-gray-900 dark:text-white">Menu</p>
                        <ul>
                            <li>
                                <MenuButton
                                    label="Vote"
                                    onClick={() => handleNavigationMobile('/vote')}
                                    className="dark:text-red-700 text-red-900"
                                />
                            </li>
                            <ul className="ml-4">
                                <li>
                                    <MenuButton
                                        label="Leaderboard"
                                        onClick={() => handleNavigationMobile('/leaderboard')}
                                    />
                                </li>
                            </ul>

                            <li>
                                <MenuButton label="Races" onClick={() => handleNavigationMobile('/races')} />
                            </li>

                            <ul className="ml-4">
                                {raceMenuItems.map((component) => (
                                    <li key={component.title}>
                                        <MenuButton
                                            label={component.title}
                                            onClick={() => handleNavigationMobile(component.href)}
                                        />
                                    </li>
                                ))}
                            </ul>

                            <li>
                                <MenuButton label="Drivers" onClick={() => handleNavigationMobile('/drivers')} />
                            </li>

                            <ul className="ml-4">
                                {driverMenuItems.map((component) => (
                                    <li key={component.title}>
                                        <MenuButton
                                            label={component.title}
                                            onClick={() => handleNavigationMobile(component.href)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </ul>
                    </div>

                    {/* LEFT CENTER */}
                    <div>
                        <ul>
                            <li>
                                <MenuButton
                                    label="Constructors"
                                    onClick={() => handleNavigationMobile('/constructors')}
                                />
                            </li>

                            <ul className="ml-4">
                                {constructorMenuItems.map((component) => (
                                    <li key={component.title}>
                                        <MenuButton
                                            label={component.title}
                                            onClick={() => handleNavigationMobile(component.href)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </ul>
                    </div>

                    {/* RIGHT CENTER */}
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Resources</p>

                        <ul className="mt-4 ml-2 space-y-4 text-sm">
                            <li>
                                <a
                                    href="http://www.formula1.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                                >
                                    Formula 1™
                                </a>
                            </li>
                            <li>
                                The most, amazing:{' '}
                                <a
                                    href="http://www.github.com/f1db/f1db"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200 font-bold"
                                >
                                    F1DB
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/bacinger/f1-circuits"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                                >
                                    Formula 1™ circuits in GEOJSON format
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://openf1.org/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                                >
                                    OpenF1
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://ergast.com/mrd/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                                >
                                    Ergast API (Deperecated)
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://f1pace.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                                >
                                    F1 Pace
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-end gap-4">
                    <a href="https://dah007.dev" target="_blank" rel="noreferrer">
                        <img src={dah007Logo} alt="DAH007 Logo" className="w-32" />
                    </a>

                    <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2025 F1//sp, DAH007.dev</p>
                </div>
                <p>
                    All content presented on this site, including statistics, predictions, and analyses, is provided for
                    informational and entertainment purposes only. This site respects all copyright laws and
                    intellectual property rights. Any Formula 1-related trademarks, logos, or content remain the
                    property of their respective owners. Do not think bad thoughts about Happy Fun Ball. This site is
                    not affiliated with Formula 1 or its parent organizations. If you believe any material featured on
                    this site violates copyright or intellectual property laws, please contact us immediately for review
                    and resolution.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
