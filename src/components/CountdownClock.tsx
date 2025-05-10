import { useState, useEffect } from 'react';

type CountdownClockProps = {
    targetDate: string;
};

interface TimeLeft {
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
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
    const calculateTimeLeft = () => {
        const raceDay = new Date(targetDate);
        const raceWeekend = new Date().setDate(raceDay.getDate() - 2);

        console.log('raceWeekend', raceWeekend);

        const difference = +new Date(raceWeekend) - +new Date();

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
                days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const formatTime = (time: TimeLeft): string => {
        return `${time.months} months, ${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds`;
    };

    return <div>{formatTime(timeLeft)}</div>;
};

export default CountdownClock;
