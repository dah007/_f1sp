import { Button } from 'components/ui/button';
import Header from 'components/Header';

import NextReactBanner from './components/NextRaceBanner';
import Card from './components/Card';
import { LucideSquareArrowOutUpRight } from 'lucide-react';
import './App.css';

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
                <div className="">
                    <NextReactBanner />

                    <div className="flex gap-4">
                        <Card>
                            <div className="flex flex-col gap-4 text-left">
                                Every race, racer, constructor, track, etc.
                                <span className="flex items-center">
                                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></span>

                                    <span className="shrink-0 px-4 text-gray-900 dark:text-white">Title goes here</span>

                                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></span>
                                </span>
                                Many, many thanks to the awesome: CUPOFR D <LucideSquareArrowOutUpRight />
                            </div>
                        </Card>
                        <>wtf?</>
                        <Card>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-bold">Title goes here</h2>
                                <p>Some content goes here.</p>
                            </div>
                        </Card>
                    </div>
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
