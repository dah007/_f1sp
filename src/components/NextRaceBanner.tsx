import { RootState, useAppSelector } from 'app/store';
// import { DateTime } from 'luxon';
import { JSX } from 'react';
// import CountdownClock from './CountdownClock';

/**
 * Component to display the next race banner.
 *
 * @component
 * @returns {JSX.Element} A JSX element displaying the next race information or an empty fragment if no race details are provided.
 */
const NextReactBanner: React.FC = (): JSX.Element => {
    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);

    const renderBanner = () => {
        if (!raceNext || !raceNext.date) return;

        // // Calculate Friday midnight before the Sunday race
        // let weekendStartISO = DateTime.fromISO(getWeekendStart(`${raceNext.date}T00:00:00Z`), { zone: 'UTC+4' }).toString();
        // console.log('startISO:', startISO);

        // weekendStartISO = DateTime.fromISO(weekendStartISO, { zone: 'UTC', zone: CIRCUIT_DETAILS['monoco'].timezone. })

        // console.log('?d date/time??:', DateTime.fromISO(`${raceNext.date}`));

        return (
            <>
                {/* <CountdownClock targetDate={new Date().toString()} /> */}

                <div
                    className="
                krona-one-regular 
                flex 
                flex-col 
                sm:flex-col
                xl:text-xl 
                lg:text-lg 
                text-sm
            "
                >
                    <span>{`Next Race: ${raceNext.date || ''} @ ${raceNext.official_name || 'N/A'}`}</span>
                </div>
            </>
        );
    };

    return (
        <div
            className="
            flex
            items-end
            justify-center
            gap-2
            text-center
            align-middle
            raceNext
            racingFont
            lg:text-3xl
            md:text-2xl
            text-xl
            pb-2
        "
        >
            {renderBanner()}
        </div>
    );
};

export default NextReactBanner;
