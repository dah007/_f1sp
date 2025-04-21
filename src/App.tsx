import { Button } from 'components/ui/button';
import Header from 'components/Header';

import './App.css';
import NextReactBanner from './components/NextRaceBanner';
import { LucideSquareArrowOutUpRight } from 'lucide-react';

function list() {
    console.log('List button clicked');
}

const App = () => {
    return (
        <>
            <Header />
            <div
                className="
                border-b 
                border-primary
                flex 
                flex-col 
                gap-12 
                p-10
                sm:p-4 sm:pt-4
                shadow-md"
            >
                <div className="container flex flex-col">
                    <NextReactBanner />
                    <blockquote>
                        Every race, racer, constructor, track, etc.
                        <span className="flex items-center">
                            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

                            <span className="shrink-0 px-4 text-gray-900 dark:text-white">Title goes here</span>

                            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
                        </span>
                        Many, many thanks to the awesome{' '}
                        <button
                            type="button"
                            className="text-blue-500 hover:underline cursor-pointer relative pr-4"
                            onClick={() => window.open('https://github.com/f1db/f1db', '_blank')}
                            rel="noopener noreferrer"
                        >
                            <LucideSquareArrowOutUpRight className="w-3 h-3 top-0 right-0 absolute" />
                            F1DB
                        </button>{' '}
                        -- without whom I never would have started this project early last season (20224)!
                    </blockquote>
                </div>
                <div className="flex gap-4">
                    <Button
                        id="list"
                        onClick={list}
                        className="cursor-pointer hover:bg-slate-300 font-bold py-2 px-4 rounded"
                    >
                        Vote
                    </Button>
                    <Button id="get" onClick={list}>
                        Drivers
                    </Button>
                    <Button id="update" onClick={list}>
                        Races
                    </Button>
                </div>
            </div>
        </>
    );
};

export default App;
