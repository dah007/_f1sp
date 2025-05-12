import Header from 'components/Header';

import './App.css';

import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './routes/Home';
import { lazy, Suspense, useEffect } from 'react';
import { NextRaceProps, RaceResultProps } from './types/races';
import { RootState, useAppDispatch, useAppSelector } from './app/store';
import { useGetLastRaceResultsQuery, useGetNextRaceQuery } from './features/raceApi';
import { setRaceNext } from './slices/racesSlice';

import Footer from './components/Footer';

import Error404Image from './assets/images/404.png';
import Leaderboard from './routes/Leaderboard';
import { setError, setLoading } from './slices/siteWideSlice';

const Circuits = lazy(() => import('./routes/Circuits/Circuits'));
const Constructors = lazy(() => import('./routes/Constructors'));
const DriverDetail = lazy(() => import('./routes/DriverDetail'));
const Drivers = lazy(() => import('./routes/Drivers'));
const Extra = lazy(() => import('./routes/Extra'));
const LoginForm = lazy(() => import('./routes/LoginForm'));
const Races = lazy(() => import('./routes/Races'));
const Seasons = lazy(() => import('./routes/Seasons'));
const Standings = lazy(() => import('./routes/Standings'));
const VoteDnD = lazy(() => import('./routes/VoteDnD'));
const AccountNew = lazy(() => import('./routes/AccountNew'));

const App = () => {
    const dispatch = useAppDispatch();

    const loading = useAppSelector((state: RootState) => state.siteWide.loading);
    // NEXT RACE
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const {
        data: nextRaceData,
        isLoading: nextRaceLoading,
        isError: nextRaceError,
    } = useGetNextRaceQuery(0) as {
        data: RaceResultProps | undefined;
        isLoading: boolean;
        isError: boolean;
    };
    useEffect(() => {
        if (nextRaceError) {
            dispatch(setError(true));
            return;
        }
        if (nextRaceLoading) dispatch(setLoading(true));
        if (!nextRaceData) return;
        dispatch(setLoading(false));
        dispatch(setRaceNext(nextRaceData as unknown as NextRaceProps));

        const lastRaceId = nextRaceData.id - 1 || 0;

        if (lastRaceId < 0) {
            console.error('Invalid lastRaceId:', lastRaceId);
            return;
        }
    }, [nextRace, dispatch, useGetLastRaceResultsQuery, nextRaceData, nextRaceLoading, nextRaceError]);
    // </nextRace>

    return (
        <Router>
            <div className="pt-0 mt-0 pb-10 flex flex-col gap-4 h-[100vh]">
                <div
                    className="border-2 border-b-0 border-l-0 border-r-0
                            sm:border-amber-300 
                            md:border-orange-600 
                            lg:border-blue-300 
                            xl:border-green-300 
                            border-slate-700 
                            absolute top-0 
                            left-0 
                            w-full
                            h-[1px] 
                            z-50 
                            bg-zinc-550"
                ></div>

                <Header />

                {/*
                LOADERS ARE COMMENTED OUT BECAUSE THEY ARE BUSTED
                TODO: REFACTOR
                */}
                {/* {loading && (
                    <div className="loader bg-zinc-300 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">
                        <div className="circle">
                            <div className="dot"></div>
                            <div className="outline"></div>
                        </div>
                        <div className="circle">
                            <div className="dot"></div>
                            <div className="outline"></div>
                        </div>
                        <div className="circle">
                            <div className="dot"></div>
                            <div className="outline"></div>
                        </div>
                        <div className="circle">
                            <div className="dot"></div>
                            <div className="outline"></div>
                        </div>
                    </div>
                )} */}

                <main
                    className="
                    xl:pl-20 xl:pr-20
                    lg:pl-10 lg:pr-10
                    md:pl-10 md:pr-10
                    sm:pl-4 sm:pr-4
                    pl-1 pr-1 w-[100vw]"
                >
                    <Suspense fallback={<div className="flex justify-center items-center h-[50vh]">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />

                            <Route path="circuits" element={<Circuits />} />

                            <Route path="constructors/:year?" element={<Constructors />} />

                            <Route path="drivers/:year?" element={<Drivers />}>
                                <Route path="driver/:id" element={<DriverDetail />} />
                            </Route>

                            <Route path="extra" element={<Extra />} />

                            <Route path="leaderboard" element={<Leaderboard />} />

                            <Route path="account/new" element={<AccountNew />} />
                            <Route path="login" element={<LoginForm />} />

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
                    </Suspense>
                </main>

                <Footer />
            </div>
        </Router>
    );
};

export default App;
