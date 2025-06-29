import { useCallback, useEffect, useState } from 'react';

type CountdownClockProps = {
    targetDate: string; // ISO string, e.g., "2025-05-23T18:00:00"
};

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * CountdownClock component displays a countdown timer to a specified target date.
 *
 * @component
 * @param {CountdownClockProps} props - The properties for the CountdownClock component.
 * @param {Date} props.targetDate - The target date to count down to.
 * @returns {JSX.Element} The rendered countdown clock component.
 *
 * @example
 * <CountdownClock targetDate={new Date('2023-12-31T23:59:59')} />
 *
 * @remarks
 * This component uses a `useEffect` hook to set up a timer that updates the countdown every second.
 * The `calculateTimeLeft` function computes the remaining time until the target date.
 */
const CountdownClock: React.FC<CountdownClockProps> = ({ targetDate }: CountdownClockProps): JSX.Element => {
    const calculateTimeLeft = useCallback((): TimeLeft => {
        const now = new Date();
        const target = new Date(targetDate);
        const difference = target.getTime() - now.getTime();

        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft, targetDate]);

    return (
        <div>
            {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
        </div>
    );
};

export default CountdownClock;
