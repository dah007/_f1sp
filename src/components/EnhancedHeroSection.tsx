import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NextRaceData {
    raceName: string;
    circuitName: string;
    country: string;
    date: string;
    time: string;
    round: number;
    season: number;
}

interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const EnhancedHeroSection: React.FC = () => {
    const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Mock next race data - replace with your actual data
    const nextRace: NextRaceData = {
        raceName: 'Bahrain Grand Prix',
        circuitName: 'Bahrain International Circuit',
        country: 'Bahrain',
        date: '2025-03-16',
        time: '15:00',
        round: 1,
        season: 2025,
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const raceTime = new Date(`${nextRace.date}T${nextRace.time}:00`).getTime();
            const distance = raceTime - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [nextRace.date, nextRace.time]);

    const CountdownCard = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg border border-red-500/30">
            <div className="text-3xl md:text-4xl font-bold text-white racing-sans-one-regular">
                {value.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-red-100 uppercase tracking-wider font-medium">{label}</div>
        </div>
    );

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-red-900/20 to-zinc-900 rounded-xl shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:30px_30px] animate-pulse"></div>
            </div>

            {/* Checkered flag pattern overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className="w-full h-full bg-[conic-gradient(from_0deg,#000_0deg_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)] bg-[length:8px_8px]"></div>
            </div>

            <div className="relative z-10 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-2">
                            <span className="text-red-500">F1</span>
                            <span className="text-orange-500">&#47;&#47;</span>
                            <span className="text-cyan-400">sp</span>
                        </h1>
                        <p className="text-zinc-400 text-lg">Formula 1 Statistics Portal</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <span className="text-white font-semibold">Season {nextRace.season}</span>
                    </div>
                </div>

                {/* Next Race Information */}
                <Card className="bg-black/40 border border-zinc-700/50 backdrop-blur-sm mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="w-5 h-5 text-red-500" />
                                    <span className="text-red-500 font-semibold uppercase tracking-wide">
                                        Next Race
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white racing-sans-one-regular mb-1">
                                    {nextRace.raceName}
                                </h2>
                                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 text-zinc-300">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{nextRace.circuitName}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {nextRace.date} at {nextRace.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-zinc-400 text-sm uppercase tracking-wider mb-1">Round</div>
                                <div className="text-3xl font-bold text-white">{nextRace.round}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Countdown Timer */}
                <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6 racing-sans-one-regular">
                        RACE STARTS IN
                    </h3>
                    <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto">
                        <CountdownCard value={countdown.days} label="DAYS" />
                        <CountdownCard value={countdown.hours} label="HRS" />
                        <CountdownCard value={countdown.minutes} label="MIN" />
                        <CountdownCard value={countdown.seconds} label="SEC" />
                    </div>
                </div>

                {/* Live indicators */}
                <div className="flex justify-center mt-8 space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-zinc-400 text-sm">Live Data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-zinc-400 text-sm">Real-time Updates</span>
                    </div>
                </div>
            </div>

            {/* Racing stripes */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-white to-red-600"></div>
        </div>
    );
};

export default EnhancedHeroSection;
