import { RootState, useAppSelector } from '@/app/store';
import {
    useGetFastestLapsByYearQuery,
    useGetTotalConstructorWinsBySeasonQuery,
    useGetTotalDNFBySeasonQuery,
    useGetTotalWinsBySeasonQuery,
} from '@/features/seasonsApi';
import {
    setFastestLapsByYear,
    setTotalConstructorsBySeason,
    setTotalDNFBySeason,
    setTotalWinsBySeason,
} from '@/slices/seasonsSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const SeasonDetail = () => {
    const dispatch = useDispatch();

    const fastestLaps = useAppSelector((state: RootState) => state.seasons.fastestLapsByYear);
    const totalWins = useAppSelector((state: RootState) => state.seasons.totalWinsBySeason);
    const constructorWins = useAppSelector((state: RootState) => state.seasons.totalConstructorsBySeason);
    const totalDNF = useAppSelector((state: RootState) => state.seasons.totalDNFBySeason);

    const { year } = useParams<{ year: string }>();

    // ? Fetch fastest laps by year
    const {
        data: fastestLapsData,
        isLoading: isFastestLapsLoading,
        isError: isFastestLapsError,
    } = useGetFastestLapsByYearQuery(year ? parseInt(year, 10) : undefined);

    useEffect(() => {
        if (isFastestLapsLoading) {
            dispatch(setLoading(true));
            return;
        }
        if (isFastestLapsError) {
            console.error('Error fetching fastest laps:', isFastestLapsError);
            dispatch(setLoading(false));
            dispatch(setError(true));
            return;
        }
        if (!fastestLapsData) return;

        dispatch(setLoading(false));
        dispatch(setFastestLapsByYear(fastestLapsData));
    }, [dispatch, fastestLapsData, isFastestLapsError, isFastestLapsLoading]);

    // ? Total CONSTRUCTOR Wins by Season
    const {
        data: constructorWinsData,
        isLoading: isConstructorWinsLoading,
        isError: isConstructorWinsError,
    } = useGetTotalConstructorWinsBySeasonQuery(year ? parseInt(year, 10) : undefined);
    useEffect(() => {
        if (isConstructorWinsLoading) {
            dispatch(setLoading(true));
            return;
        }
        if (isConstructorWinsError) {
            console.error('Error fetching constructor wins:', isConstructorWinsError);
            dispatch(setLoading(false));
            dispatch(setError(true));
            return;
        }
        if (!constructorWinsData) return;

        dispatch(setLoading(false));
        dispatch(setTotalConstructorsBySeason(constructorWinsData));
    }, [dispatch, constructorWinsData, isConstructorWinsError, isConstructorWinsLoading]);

    // ? Total DNF by Season
    const {
        data: totalDNFData,
        isLoading: isTotalDNFLoading,
        isError: isTotalDNFError,
    } = useGetTotalDNFBySeasonQuery(year ? parseInt(year, 10) : undefined);
    useEffect(() => {
        if (isTotalDNFLoading) {
            dispatch(setLoading(true));
            return;
        }
        if (isTotalDNFError) {
            console.error('Error fetching total DNF by season:', isTotalDNFError);
            dispatch(setLoading(false));
            dispatch(setError(true));
            return;
        }
        if (!totalDNFData) return;

        dispatch(setLoading(false));
        dispatch(setTotalDNFBySeason(totalDNFData));
    }, [dispatch, totalDNFData, isTotalDNFError, isTotalDNFLoading]);

    // ? Total Wins by Season
    const {
        data: totalWinsData,
        isLoading: isTotalWinsLoading,
        isError: isTotalWinsError,
    } = useGetTotalWinsBySeasonQuery(year ? parseInt(year, 10) : undefined);
    useEffect(() => {
        if (isTotalWinsLoading) {
            dispatch(setLoading(true));
            return;
        }
        if (isTotalWinsError) {
            console.error('Error fetching total wins:', isTotalWinsError);
            dispatch(setLoading(false));
            dispatch(setError(true));
            return;
        }
        if (!totalWinsData) return;

        dispatch(setLoading(false));
        dispatch(setTotalWinsBySeason(totalWinsData));
    }, [dispatch, totalWinsData, isTotalWinsError, isTotalWinsLoading]);

    return (
        <div className="season-detail border border-red-600 p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="fastest-lap-item border-b border-zinc-300 py-2">
                    <h2 className="text-2xl font-bold">Total Wins</h2>
                </div>

                {totalWins?.map((win, index) => (
                    <div key={`${win.name}${index}`} className="fastest-lap-item border-b border-zinc-300 py-2">
                        <p>Driver: {win.name}</p>
                        <p>Total Wins: {win.wins}</p>
                    </div>
                ))}
            </div>

            <div className="flex-1">
                <div className="fastest-lap-item border-b border-zinc-300 py-2">
                    <h2 className="text-2xl font-bold">Fastest Laps</h2>
                </div>

                {fastestLaps.map((lap, index) => (
                    <div key={`${lap.name}${index}`} className="fastest-lap-item border-b border-zinc-300 py-2">
                        <p>Driver: {lap.name}</p>
                        <p>Fastest Laps: {lap.fastest_laps}</p>
                    </div>
                ))}
            </div>

            <div className="flex-1">
                <div className="fastest-lap-item border-b border-zinc-300 py-2">
                    <h2 className="text-2xl font-bold">Constructors Total Wins</h2>
                </div>

                {constructorWins.map((win, index) => (
                    <div key={`${win.name}${index}`} className="fastest-lap-item border-b border-zinc-300 py-2">
                        <p>Constructor: {win.name}</p>
                        <p>Total Wins: {win.wins}</p>
                    </div>
                ))}
            </div>

            <div className="flex-1">
                <div className="fastest-lap-item border-b border-zinc-300 py-2">
                    <h2 className="text-2xl font-bold">Total DNF</h2>
                </div>

                {totalDNF.map((dnf, index) => (
                    <div key={`${dnf.name}${index}`} className="fastest-lap-item border-b border-zinc-300 py-2">
                        <p>Driver: {dnf.name}</p>
                        <p>Total DNF: {dnf.totalDNF}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeasonDetail;
