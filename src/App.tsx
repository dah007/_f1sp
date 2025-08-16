import Header from 'components/Header';
import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { RootState, useAppDispatch, useAppSelector } from './app/store';
import Footer from './components/Footer';
import { YEAR } from './constants/constants';
import { useGetDriversQuery } from './features/driversApi';
import { useGetNextRaceQuery } from './features/raceApi';
import ConstructorStandings from './routes/ConstructorStandingsRoute';
import Home from './routes/HomeRoute';
import Leaderboard from './routes/LeaderboardRoute';
import Static from './routes/Static';
import { setRaceNext } from './slices/racesSlice';
import { setError, setLoading } from './slices/systemWideSlice';
import { RaceNextProps, RaceResultProps } from './types/races';
import Error404Image from '/assets/images/404.png';

const AccountNew = lazy(() => import('./routes/AccountNewRoute'));
const Circuits = lazy(() => import('./routes/CircuitsRoute'));
const Constructors = lazy(() => import('./routes/ConstructorsRoute'));
const DriverDetail = lazy(() => import('./routes/DriverDetailRoute'));
const Drivers = lazy(() => import('./routes/DriversRoute'));
const Engines = lazy(() => import('./routes/EnginesRoute'));
const Extra = lazy(() => import('./routes/ExtraRoute'));
const LoginForm = lazy(() => import('./routes/LoginFormRoute'));
const RaceDetail = lazy(() => import('./routes/RaceDetailRoute'));
const Races = lazy(() => import('./routes/RacesRoute'));
const RaceLast = lazy(() => import('./routes/RaceLastRoute'));
const RaceNext = lazy(() => import('./routes/RaceNextRoute'));
const RaceResults = lazy(() => import('./routes/RaceResultsRoute'));
const SeasonsRoute = lazy(() => import('./routes/SeasonsRoute'));
const SeasonsDetail = lazy(() => import('./routes/SeasonDetailRoute'));
const Standings = lazy(() => import('./routes/StandingsRoute'));
const Tyres = lazy(() => import('./routes/TyreRoute'));
const VoteDnD = lazy(() => import('./routes/VoteRoute'));

const App = () => {
    const dispatch = useAppDispatch();

    useGetDriversQuery(YEAR);

    // NEXT RACE
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const { data: raceNextData, isLoading: raceNextLoading, isError: raceNextError } = useGetNextRaceQuery(0);

    useEffect(() => {
        if (raceNextError) {
            dispatch(setError(true));
            return;
        }
        if (raceNextLoading) dispatch(setLoading(true));
        if (!raceNextData) return;
        console.log('raceNextData:', raceNextData);
        dispatch(setLoading(false));
        dispatch(setRaceNext(raceNextData as RaceNextProps));
    }, [nextRace, dispatch, raceNextData, raceNextLoading, raceNextError]);
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

                <main
                    className="
                    xl:pl-20 xl:pr-20
                    lg:pl-10 lg:pr-10
                    md:pl-10 md:pr-10
                    sm:pl-4 sm:pr-4
                    pl-1 pr-1 w-[100vw]"
                >
                    <Outlet />

                    <Suspense fallback={<div className="flex justify-center items-center h-[50vh]">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />}>
                                <Route path="whats-new" element={<Static page="whatsNew" />} />
                            </Route>

                            <Route path="circuits" element={<Circuits />} />

                            <Route path="constructors/:year?" element={<Constructors />} />
                            <Route path="constructors/standings" element={<ConstructorStandings />} />

                            <Route path="drivers/:year?" element={<Drivers />}>
                                <Route path="driver/:id" element={<DriverDetail />} />
                            </Route>

                            <Route path="engine" element={<Engines />} />
                            <Route path="extra/:tab?" element={<Extra />} />

                            <Route path="leaderboard" element={<Leaderboard />} />

                            <Route path="links" element={<Static page="links" />} />

                            <Route path="account/new" element={<AccountNew />} />
                            <Route path="login" element={<LoginForm />} />

                            <Route path="races/:year?" element={<Races />}>
                                <Route path="race/:id" element={<RaceDetail />} />
                            </Route>
                            <Route path="race/last/:id?" element={<RaceLast />} />
                            <Route path="race/next/:id?" element={<RaceNext />} />
                            <Route path="race/results/:id?" element={<RaceResults />} />

                            <Route path="seasons" element={<SeasonsRoute />}>
                                <Route path="season/:year?" element={<SeasonsDetail />} />
                            </Route>

                            <Route path="standings" element={<Standings />} />

                            <Route path="tyres" element={<Tyres />} />

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
