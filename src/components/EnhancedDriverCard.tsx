import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Trophy, Flag } from 'lucide-react';

interface DriverData {
    id: string;
    name: string;
    number: number;
    team: string;
    nationality: string;
    points: number;
    position: number;
    wins: number;
    podiums: number;
    avatar?: string;
    teamColor: string;
    form: number[]; // Last 5 race positions
    isChampion?: boolean;
}

interface EnhancedDriverCardProps {
    driver: DriverData;
    onClick?: (driver: DriverData) => void;
    showDetailedStats?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const EnhancedDriverCard: React.FC<EnhancedDriverCardProps> = ({
    driver,
    onClick,
    showDetailedStats = false,
    size = 'md'
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const getPositionChange = () => {
        if (driver.form.length < 2) return 0;
        const recent = driver.form.slice(-2);
        return recent[0] - recent[1];
    };

    const getFormTrend = () => {
        const change = getPositionChange();
        if (change > 0) return { icon: TrendingUp, color: 'text-green-500', label: 'Improving' };
        if (change < 0) return { icon: TrendingDown, color: 'text-red-500', label: 'Declining' };
        return { icon: null, color: 'text-zinc-400', label: 'Stable' };
    };

    const sizeClasses = {
        sm: 'h-32',
        md: 'h-40',
        lg: 'h-48'
    };

    const numberSize = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl'
    };

    const trend = getFormTrend();
    const TrendIcon = trend.icon;

    return (
        <Card
            className={cn(
                'relative overflow-hidden cursor-pointer transition-all duration-300 border-2',
                sizeClasses[size],
                isHovered 
                    ? 'scale-105 shadow-2xl border-white/30' 
                    : 'shadow-lg border-zinc-700/50',
                'group'
            )}
            style={{
                background: isHovered 
                    ? `linear-gradient(135deg, ${driver.teamColor}20, ${driver.teamColor}10, transparent)`
                    : 'linear-gradient(135deg, rgba(39, 39, 42, 0.8), rgba(24, 24, 27, 0.9))'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick?.(driver)}
        >
            {/* Animated background gradient */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 30% 30%, ${driver.teamColor}40, transparent 60%)`
                }}
            />

            {/* Racing number background */}
            <div 
                className={cn(
                    'absolute top-2 right-2 font-bold opacity-10 group-hover:opacity-20 transition-opacity',
                    numberSize[size]
                )}
                style={{ color: driver.teamColor }}
            >
                {driver.number}
            </div>

            {/* Championship crown */}
            {driver.isChampion && (
                <div className="absolute top-2 left-2">
                    <Trophy className="w-5 h-5 text-yellow-500 animate-pulse" />
                </div>
            )}

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Driver avatar or number */}
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 shadow-lg"
                            style={{ 
                                backgroundColor: driver.teamColor,
                                borderColor: isHovered ? 'white' : driver.teamColor 
                            }}
                        >
                            {driver.avatar ? (
                                <img 
                                    src={driver.avatar} 
                                    alt={driver.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-sm">{driver.number}</span>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg leading-tight racing-sans-one-regular">
                                {driver.name}
                            </h3>
                            <p className="text-zinc-400 text-sm">{driver.team}</p>
                        </div>
                    </div>

                    {/* Position badge */}
                    <Badge 
                        variant="secondary"
                        className={cn(
                            'text-white font-bold px-2 py-1',
                            driver.position <= 3 ? 'bg-yellow-600' : 'bg-zinc-600'
                        )}
                    >
                        P{driver.position}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Stats row */}
                <div className="flex justify-between items-center mb-3">
                    <div className="text-center">
                        <div className="text-lg font-bold text-white">{driver.points}</div>
                        <div className="text-xs text-zinc-400 uppercase">Points</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-white">{driver.wins}</div>
                        <div className="text-xs text-zinc-400 uppercase">Wins</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-white">{driver.podiums}</div>
                        <div className="text-xs text-zinc-400 uppercase">Podiums</div>
                    </div>
                </div>

                {/* Form indicator */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <Flag className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs text-zinc-400">{driver.nationality}</span>
                    </div>
                    
                    {/* Recent form */}
                    <div className="flex items-center space-x-1">
                        {TrendIcon && (
                            <TrendIcon className={cn('w-4 h-4', trend.color)} />
                        )}
                        <div className="flex space-x-1">
                            {driver.form.slice(-3).map((position, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        'w-2 h-2 rounded-full',
                                        position <= 3 ? 'bg-green-500' :
                                        position <= 10 ? 'bg-yellow-500' : 'bg-red-500'
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed stats (if enabled) */}
                {showDetailedStats && (
                    <div className="mt-3 pt-3 border-t border-zinc-700">
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>Avg Position: {(driver.form.reduce((a, b) => a + b, 0) / driver.form.length).toFixed(1)}</span>
                            <span className={trend.color}>{trend.label}</span>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Team color accent stripe */}
            <div 
                className="absolute bottom-0 left-0 w-full h-1 transition-all duration-300"
                style={{ 
                    backgroundColor: driver.teamColor,
                    boxShadow: isHovered ? `0 0 10px ${driver.teamColor}50` : 'none'
                }}
            />

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Card>
    );
};

// Example usage component
export const DriverGrid: React.FC = () => {
    const mockDrivers: DriverData[] = [
        {
            id: '1',
            name: 'Max Verstappen',
            number: 1,
            team: 'Red Bull Racing',
            nationality: 'Dutch',
            points: 575,
            position: 1,
            wins: 19,
            podiums: 21,
            teamColor: '#3671C6',
            form: [1, 2, 1, 1, 3],
            isChampion: true
        },
        {
            id: '2',
            name: 'Lando Norris',
            number: 4,
            team: 'McLaren',
            nationality: 'British',
            points: 374,
            position: 2,
            wins: 3,
            podiums: 8,
            teamColor: '#FF8000',
            form: [2, 1, 4, 2, 1]
        },
        {
            id: '3',
            name: 'Charles Leclerc',
            number: 16,
            team: 'Ferrari',
            nationality: 'Monégasque',
            points: 356,
            position: 3,
            wins: 2,
            podiums: 7,
            teamColor: '#E8002D',
            form: [3, 4, 2, 3, 5]
        }
    ];

    const handleDriverClick = (driver: DriverData) => {
        console.log('Driver clicked:', driver.name);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {mockDrivers.map((driver) => (
                <EnhancedDriverCard
                    key={driver.id}
                    driver={driver}
                    onClick={handleDriverClick}
                    showDetailedStats={true}
                    size="md"
                />
            ))}
        </div>
    );
};

export default EnhancedDriverCard;
