// import { Button } from 'components/ui/button';
import Header from 'components/Header';

import NextReactBanner from './components/NextRaceBanner';
// import { LucideSquareArrowOutUpRight } from 'lucide-react';
import './App.css';

import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './routes/Home';
import { lazy, useEffect } from 'react';
import { NextRaceProps, RaceResultProps } from './types/races';
import { RootState, useAppDispatch, useAppSelector } from './app/store';
import { useGetLastRaceResultsQuery, useGetNextRaceQuery } from './features/raceApi';
import { setRaceNext } from './slices/racesSlice';
import ModeToggle from './components/ModeToggle';

import Error404Image from './assets/images/404.png';

const Circuits = lazy(() => import('./routes/Circuits/Circuits'));
const Constructors = lazy(() => import('./routes/Constructors'));
const DriverDetail = lazy(() => import('./routes/DriverDetail'));
const Drivers = lazy(() => import('./routes/Drivers'));
// const LoginForm = lazy(() => import('./components/LoginForm'));
const Races = lazy(() => import('./routes/Races'));
const Seasons = lazy(() => import('./routes/Seasons'));
const Standings = lazy(() => import('./routes/Standings'));
const VoteDnD = lazy(() => import('./routes/VoteDnD'));

const App = () => {
    const dispatch = useAppDispatch();

    // NEXT RACE
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const { data: nextRaceData } = useGetNextRaceQuery(0) as {
        data: RaceResultProps | undefined;
        isError: boolean;
    };
    useEffect(() => {
        if (!nextRaceData) return;

        dispatch(setRaceNext(nextRaceData as unknown as NextRaceProps));

        const lastRaceId = nextRaceData.id - 1 || 0;

        if (lastRaceId < 0) {
            console.error('Invalid lastRaceId:', lastRaceId);
            return;
        }
    }, [nextRace, dispatch, useGetLastRaceResultsQuery, nextRaceData]);
    // </nextRace>

    return (
        <>
            <div className="absolute right-4 top-4">
                <ModeToggle />
            </div>
            <Router>
                <div className="pt-0 mt-0 pb-10 flex flex-col gap-4">
                    <Header />

                    <main className="pl-10 pr-10 w-[95vw] ">
                        <NextReactBanner />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="circuits" element={<Circuits />} />
                            <Route path="constructors/:year?" element={<Constructors />} />
                            <Route path="drivers/:year?" element={<Drivers />} />
                            <Route path="drivers/:year/driver/:id" element={<DriverDetail />} />
                            {/* <Route path="login" element={<LoginForm />} /> */}

                            <Route path="races/:year?/*" element={<Races />} />

                            <Route path="seasons/:year?" element={<Seasons />} />
                            <Route path="standings" element={<Standings />} />
                            <Route path="vote" element={<VoteDnD />} />
                            <Route
                                path="*"
                                element={
                                    <div className="flex flex-col items-center justify-center h-[85vh]">
                                        <h1 className="mb-6 text-3xl font-bold">404 - Not Found</h1>
                                        <img className="max-w-[40%] rounded-3xl" src={Error404Image} alt="404 Error" />
                                    </div>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </>
    );
};

export default App;
