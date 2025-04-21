import { Button } from 'components/ui/button';
import Header from 'components/Header';

import './App.css';
import NextReactBanner from './components/NextRaceBanner';

function list() {
    console.log('List button clicked');
}

const App = () => {
    return (
        <>
            <Header />
            <div
                className="
                bg-white 
                border-b 
                border-gray-200 
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
                        <br />
                        <br />
                        Many, many thanks to the awesome{' '}
                        <button
                            type="button"
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={() => window.open('https://github.com/f1db/f1db', '_blank')}
                            rel="noopener noreferrer"
                        >
                            F1DB
                        </button>
                        !
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
