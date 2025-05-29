import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { GeoJsonData } from '@/types';
import { RaceProps } from '@/types/races';
import { getGeoJsonData } from '@/utils/locations';
import { useEffect, useState } from 'react';

interface RaceDetailHeaderProps {
    race: RaceProps;
}

const RaceDetailHeader: React.FC<RaceDetailHeaderProps> = ({ race }): JSX.Element => {
    const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);

    useEffect(() => {
        if (geoJsonData !== null) return;

        if (race?.circuit_id) {
            getGeoJsonData(race.circuit_id)
                .then((data) => {
                    if (data) {
                        setGeoJsonData(data);
                    } else {
                        console.error('Failed to load GeoJSON data for circuit:', race.circuit_id);
                        setGeoJsonData(null);
                    }
                })
                .catch((error) => {
                    console.error('Error loading GeoJSON data:', error);
                    setGeoJsonData(null);
                });
        }
    }, [race?.circuit_id]);

    if (!race) return <></>;

    const circuitDetails = CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS];

    return (
        <div className="flex flex-col justify-between items-center p-4 bg-zinc-800 border-b border-zinc-700">
            <div className="w-full object-fill relative">
                <h1 className="text-2xl font-bold krona-one-regular absolute top-4 left-4 ">
                    {race.official_name || race.circuit_id}
                </h1>
                {geoJsonData && race.longitude && race.latitude ? (
                    <img
                        className="min-w-full max-w-full"
                        src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/geojson(${encodeURIComponent(
                            JSON.stringify(geoJsonData),
                        )})/${Number(race.longitude)},${Number(race.latitude)},12.45,0/1200x200?access_token=${
                            import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
                            'pk.eyJ1IjoiZGgwMDciLCJhIjoiY20wdm1weDNyMWhmajJrb2k4MWUwZmUwaiJ9.5Wt08PdFvAjhAcIoeraeEw'
                        }`}
                        alt={`${race.short_name || race.circuit_id}`}
                    />
                ) : (
                    <div className="w-full h-[200px] bg-zinc-900 flex items-center justify-center text-zinc-400">
                        Loading circuit map...
                    </div>
                )}
            </div>

            <div className="flex justify-evenly items-center gap-4 w-full p-4">
                <div>
                    <div className="text-xl font-bold r-2 krona-one-regular">When?</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {race.date} @ {race.time || 'TBD'} local time
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Where?</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {circuitDetails?.place_name || 'N/A'}
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {race.round || 'TBD'} of {race.total_rounds || 'TBD'}
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {(circuitDetails?.length ?? 1) / 1000 || 'TBD'} km
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">More Info</div>
                    {race?.circuit_id && CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                        <a
                            className="text-blue-500 hover:underline"
                            href={CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ?? ''}
                            referrerPolicy="no-referrer"
                            target="_blank"
                        >
                            WiKi
                        </a>
                    )}
                </div>

                <div>
                    <img
                        className="max-w-[300px]"
                        alt={race.official_name || race.circuit_id}
                        src={`/assets/tracks/${race.circuit_id}.png`}
                    />
                </div>
            </div>
        </div>
    );
};

export default RaceDetailHeader;
