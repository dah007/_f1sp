import DriverStandings from '@/components/DriverStandings';
import { YEAR } from '@/constants/constants';

const SeasonCurrent = () => {
    const heightOverride = 'h-[42vh] md:h-[72vh] lg:h-[72vh] xl:h-[72vh]';
    return (
        <div>
            <h1>Current Season</h1>
            <p>This is the current season page.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[72vh] bg-amber-900">
                <div>
                    <DriverStandings className={heightOverride} year={YEAR} />
                </div>
                <div>constructors</div>
            </div>
        </div>
    );
};

export default SeasonCurrent;
