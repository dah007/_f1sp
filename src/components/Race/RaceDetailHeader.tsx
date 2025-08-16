import { RaceProps } from '@/types/races';

const RaceDetailHeader: React.FC<{ race: RaceProps }> = ({ race }): JSX.Element => {
    if (!race) return <></>;

    return (
        <div className="flex justify-start items-start w-full m-0 p-4">
            <h1 className="text-2xl font-bold krona-one-regular text-amber-500 shadow-2xl">
                {race.official_name || race.circuit_id}
            </h1>
        </div>
    );
};

export default RaceDetailHeader;
