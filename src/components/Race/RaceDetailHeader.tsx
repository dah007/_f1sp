// import { GeoJsonData } from '@/types';
import { RaceProps } from '@/types/races';
// import { getGeoJsonData } from '@/utils/locations';
// import { useEffect, useState } from 'react';

const RaceDetailHeader: React.FC<{ race: RaceProps }> = ({ race }): JSX.Element => {
    // const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);

    // useEffect(() => {
    //     if (geoJsonData !== null) return;

    //     if (race?.circuit_id) {
    //         getGeoJsonData(race.circuit_id)
    //             .then((data) => {
    //                 if (data) {
    //                     setGeoJsonData(data);
    //                 } else {
    //                     console.error('Failed to load GeoJSON data for circuit:', race.circuit_id);
    //                     setGeoJsonData(null);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('Error loading GeoJSON data:', error);
    //                 setGeoJsonData(null);
    //             });
    //     }
    // }, [race?.circuit_id]);

    if (!race) return <></>;

    return (
        <div className="flex justify-start items-start w-full m-0 p-4">
            {/* <div className="w-full object-fill relative h-[75px]"> */}
            <h1 className="text-2xl font-bold krona-one-regular text-amber-500 shadow-2xl">
                {race.official_name || race.circuit_id}
            </h1>
            {/* {geoJsonData && race.longitude && race.latitude ? (
                    <img
                        className="min-w-full max-w-full"
                        src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/geojson(${encodeURIComponent(
                            JSON.stringify(geoJsonData),
                        )})/[${geoJsonData?.bbox}]/1200x150?padding=20&access_token=${
                            import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
                            'pk.eyJ1IjoiZGgwMDciLCJhIjoiY20wdm1weDNyMWhmajJrb2k4MWUwZmUwaiJ9.5Wt08PdFvAjhAcIoeraeEw'
                        }`}
                        alt={`${race.short_name || race.circuit_id}`}
                    />
                ) : (
                    <div className="w-full h-[130px] bg-zinc-900 flex items-center justify-center text-zinc-400">
                        Loading circuit map...
                    </div>
                )} */}
            {/* </div> */}
        </div>
    );
};

export default RaceDetailHeader;
