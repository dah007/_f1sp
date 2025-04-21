import { Button } from 'components/ui/button';

import F1SPlogo from 'assets/favicon.svg';

import './App.css';
import { dbFetch } from './utils';

const App = () => {
    const list = async () => {
        const response = await dbFetch('/data-api/rest/Person');
        console.log('List:', response);
    };

    const get = async () => {
        const response = await fetch('/api/database-connections/1');
        const data = await response.json();
        console.log('Get:', data);
    };
    const update = async () => {
        console.log('Update:');
        // const response = await fetch('/api/database-connections/1', {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         name: 'Updated Connection',
        //         connectionString: 'Server=updated-server;Database=updated-db;User Id=updated-user;Password=updated-password;',
        //     }),
        // });
        // const data = await response.json();
        // console.log('Update:', data);
    };
    const create = async () => {
        console.log('Create:');
        // const response = await fetch('/api/database-connections', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         name: 'New Connection',
        //         connectionString: 'Server=new-server;Database=new-db;User Id=new-user;Password=new-password;',
        //     }),
        // });
        // const data = await response.json();
        // console.log('Create:', data);
    };
    const del = async () => {
        console.log('Delete:');
        // const response = await fetch('/api/database-connections/1', {
        //     method: 'DELETE',
        // });
        // const data = await response.json();
        // console.log('Delete:', data);
    };

    return (
        <div
            className="
            bg-white 
            border 
            border-gray-200 
            dark:bg-gray-800
            dark:border-gray-700 
            flex 
            flex-col 
            gap-12 
            p-10 
            shadow-md"
        >
            <div className="flex justify-start">
                <img src={F1SPlogo} alt="F1SP Logo" className="h-32" />
            </div>
            <div className="container">
                <h1 className="text-3xl italic font-extrabold racing-sans-one-regular">
                    Formula 1 - Stats & Predictions
                </h1>
                <blockquote>
                    Every race, racer, constructor, track, etc. Thanks to the awesome{' '}
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
                <Button id="get" onClick={get}>
                    Drivers
                </Button>
                <Button id="update" onClick={update}>
                    Races
                </Button>
                <Button id="create" onClick={create}>
                    Constructors
                </Button>
                <Button id="delete" onClick={del}>
                    Hello
                </Button>
            </div>
        </div>
    );
};

export default App;
