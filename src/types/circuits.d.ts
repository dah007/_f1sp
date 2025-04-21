export type BBoxType = LngLatBounds | [LngLatLike, LngLatLike] | [number, number, number, number];

export type CircuitProps = {
    altitude: number | null;
    bbox: BBoxType;
    circuitType: string | null;
    country: string | null;
    date?: string | null;
    firstgp: number | null;
    full_name: string | null;
    id: string;
    latitude: number;
    length: number | null;
    longitude: number;
    name: string | null;
    official_name: string | null;
    opened: number | null;
    place_name: string | null;
    raceDate?: string | null;
    shortName: string | null;
    wiki?: string | null;
    continent?: string;
};

export type CircuitDetailsProps = {
    [key: string]: CircuitProps;
};
export type ContinentProps = {
    [key: string]: {
        center: TLongLat;
        zoom: number;
    };
};

// ? MAPBOX is LONG, LAT -- not LAT, LONG
export type TLongLat = [longitude: number, latitude: number];
