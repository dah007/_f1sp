import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Star, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RaceResult {
    position: number;
    driver: string;
    team: string;
    time: string;
    gap?: string;
    points?: number;
    teamColor?: string;
    fastestLap?: boolean;
    dnf?: boolean;
    startPosition?: number;
}

interface EnhancedRaceResultsProps {
    showPodium?: boolean;
    raceData: RaceResult[]; // Changed from RaceProps[] to RaceResult[]
    showFastestLap?: boolean;
}

const mockRaceData: RaceResult[] = [
    // Changed from RaceData to RaceResult[]
    {
        position: 1,
        driver: 'Charles Leclerc',
        team: 'Ferrari',
        time: '1:44:34.982',
        gap: '',
        points: 25,
        teamColor: '#E8002D',
        fastestLap: false,
        startPosition: 1,
    },
    {
        position: 2,
        driver: 'Oscar Piastri',
        team: 'McLaren',
        time: '1:44:42.147',
        gap: '7.165',
        points: 18,
        teamColor: '#FF8000',
        fastestLap: true,
        startPosition: 3,
    },
    {
        position: 3,
        driver: 'Carlos Sainz',
        team: 'Ferrari',
        time: '1:44:58.643',
        gap: '23.661',
        points: 15,
        teamColor: '#E8002D',
        fastestLap: false,
        startPosition: 4,
    },
    {
        position: 4,
        driver: 'Lando Norris',
        team: 'McLaren',
        time: '1:45:12.458',
        gap: '37.476',
        points: 12,
        teamColor: '#FF8000',
        fastestLap: false,
        startPosition: 2,
    },
    {
        position: 5,
        driver: 'George Russell',
        team: 'Mercedes',
        time: '1:45:23.111',
        gap: '48.129',
        points: 10,
        teamColor: '#00A19B',
        fastestLap: false,
        startPosition: 5,
    },
];

const EnhancedRaceResults: React.FC<EnhancedRaceResultsProps> = ({ showPodium = true, showFastestLap = true }) => {
    const [animationPhase, setAnimationPhase] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (animationPhase < 3) {
                setAnimationPhase(animationPhase + 1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [animationPhase]);

    // Split results for podium display
    // const podiumResults = raceData?.slice(0, 3);
    // const otherResults = raceData?.slice(3);

    const PodiumStep = ({
        result,
        height,
        position,
        delay,
    }: {
        result: RaceResult;
        height: string;
        position: number;
        delay: number;
    }) => {
        const isVisible = animationPhase >= delay;

        return (
            <div
                className={cn(
                    'relative flex flex-col items-center transition-all duration-1000 ease-out',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                )}
                style={{ transitionDelay: `${delay * 200}ms` }}
            >
                {/* Trophy/Position indicator */}
                <div className="mb-2">
                    {position === 1 && <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />}
                    {position === 2 && (
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                            2
                        </div>
                    )}
                    {position === 3 && (
                        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                            3
                        </div>
                    )}
                </div>

                {/* Driver info */}
                <div className="text-center mb-4 z-10">
                    <div className="font-bold text-white text-sm mb-1 racing-sans-one-regular">{result.driver}</div>
                    <div className="text-xs text-zinc-400">{result.team}</div>
                    <div className="text-xs text-zinc-300 mt-1">{result.time}</div>
                    {result.fastestLap && (
                        <div className="flex items-center justify-center mt-1">
                            <Zap className="w-3 h-3 text-purple-500 mr-1" />
                            <span className="text-xs text-purple-400">Fastest Lap</span>
                        </div>
                    )}
                </div>

                {/* Podium step */}
                <div
                    className={cn(
                        'w-20 rounded-t-lg relative shadow-lg border-t-4 transition-all duration-1000',
                        height,
                        position === 1 && 'bg-gradient-to-b from-yellow-400 to-yellow-600 border-yellow-300',
                        position === 2 && 'bg-gradient-to-b from-gray-300 to-gray-500 border-gray-200',
                        position === 3 && 'bg-gradient-to-b from-amber-500 to-amber-700 border-amber-400',
                    )}
                    style={{
                        background: isVisible
                            ? undefined
                            : `linear-gradient(to bottom, ${result.teamColor}40, ${result.teamColor}80)`,
                    }}
                >
                    {/* Position number */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
                        {position}
                    </div>

                    {/* Team color accent */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-2"
                        style={{ backgroundColor: result.teamColor }}
                    />
                </div>
            </div>
        );
    };

    const ResultRow = ({ result, index }: { result: RaceResult; index: number }) => {
        let positionChange = 0;

        if (!result) return null;

        if (result.startPosition !== undefined) {
            positionChange = result?.startPosition - result.position;
        }

        return (
            <div
                className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:bg-zinc-800/50',
                    index % 2 === 0 ? 'bg-zinc-900/30' : 'bg-zinc-800/30',
                )}
            >
                <div className="flex items-center space-x-4">
                    {/* Position */}
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">
                        {result.dnf ? 'DNF' : result.position}
                    </div>

                    {/* Driver info */}
                    <div>
                        <div className="font-semibold text-white">{result.driver}</div>
                        <div className="text-sm text-zinc-400">{result.team}</div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Position change */}
                    {positionChange !== 0 && !result.dnf && (
                        <div
                            className={cn(
                                'flex items-center space-x-1 text-xs',
                                positionChange > 0 ? 'text-green-500' : 'text-red-500',
                            )}
                        >
                            <span>
                                {positionChange > 0 ? '+' : ''}
                                {positionChange}
                            </span>
                        </div>
                    )}

                    {/* Special indicators */}
                    <div className="flex space-x-1">
                        {result.fastestLap && <Zap className="w-4 h-4 text-purple-500" />}
                        Fastest Lap
                    </div>

                    {/* Time/Gap */}
                    <div className="text-right">
                        <div className="text-white text-sm font-mono">{result.time}</div>
                        {result.gap && <div className="text-zinc-400 text-xs">+{result.gap}</div>}
                    </div>

                    {/* Points */}
                    <div className="w-12 text-center">
                        <Badge variant="secondary" className="bg-zinc-600 text-white">
                            {result.points}
                        </Badge>
                    </div>
                </div>

                {/* Team color indicator */}
                <div className="w-1 h-8 rounded-full ml-2" style={{ backgroundColor: result.teamColor }} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Race header */}
            <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white racing-sans-one-regular">
                                {mockRaceData[0].dnf} race
                            </h2>
                            <p className="text-zinc-400">
                                {/* {mockRaceData[0]?.team} circuiit • {mockRaceData[0]?.date} */}
                                circuit • date
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-zinc-400 text-sm">Weather</div>
                            <div className="text-white">100000</div>
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Podium visualization */}
            {showPodium && (
                <Card className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-center text-white">Race Podium</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <div className="flex items-end justify-center space-x-8 relative">
                            {/* Confetti effect for winner */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
                                {animationPhase >= 2 && (
                                    <div className="animate-pulse">
                                        {[...Array(6)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    'absolute w-4 h-4 text-yellow-400 animate-bounce',
                                                    `top-${i * 2} left-${i * 4}`,
                                                )}
                                                style={{
                                                    animationDelay: `${i * 100}ms`,
                                                    animationDuration: '2s',
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 2nd place */}
                            <PodiumStep result={mockRaceData[1]} height="h-24" position={2} delay={1} />

                            {/* 1st place */}
                            <PodiumStep result={mockRaceData[0]} height="h-32" position={1} delay={2} />

                            {/* 3rd place */}
                            <PodiumStep result={mockRaceData[2]} height="h-20" position={3} delay={0} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Full results table */}
            <Card className="bg-zinc-900/50 border-zinc-700">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                        <span>Race Results</span>
                        {showFastestLap && (
                            <div className="flex items-center space-x-2 text-sm text-zinc-400">
                                <Zap className="w-4 h-4 text-purple-500" />
                                <span>Fastest Lap</span>
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {/* Podium results */}
                    {mockRaceData.map((result, index) => (
                        <ResultRow key={`podium-${index}`} result={result} index={index} />
                    ))}

                    {/* Separator */}
                    <div className="border-t border-zinc-700 my-4" />

                    {/* Other results */}
                    {mockRaceData.map((result, index) => (
                        <ResultRow key={`other-${index}`} result={result} index={index + 3} />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

// // Example usage with mock data
// export const ExampleRaceResults: React.FC = () => {

//     return (
//         <div className="p-4 max-w-6xl mx-auto">
//             <EnhancedRaceResults raceData={mockRaceData} showPodium={true} showFastestLap={true} />
//         </div>
//     );
// };

export default EnhancedRaceResults;
//             <EnhancedRaceResults raceData={mockRaceData} showPodium={true} showFastestLap={true} />
//         </div>
//     );
// };

// export default EnhancedRaceResults;
