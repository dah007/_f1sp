
export type BBoxType = LngLatBounds | [LngLatLike, LngLatLike] | [number, number, number, number];

export type CircuitProps = {
    altitude: number | null;
    bbox: BBoxType;
    circuitType: string | null;
    continent?: string;
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
    timezone: {
        dst: boolean
        offset: number;
        start: {
            month: number;
            day: number;
            hour: number;
        };
        end: {
            month: number;
            day: number;
            hour: number;
        };
        name: string | null;
    },    // string | null;
    wiki?: string | null;
};

export type CircuitDetailsProps = {
    [key: string]: CircuitProps;
};
export type ContinentProps = {
    [key: string]: {
        center: [LngLatLike, LngLatLike]; // ? just remember kids! mapbox is [lng, lat] and not [lat, lng]
        zoom: number;
    };
};

export type CircuitLabelProps = {
    circuitsData: CircuitProps[] | undefined;
    id: string;
    map: Map | null;
    newBBox: number[];
    originalLabel: string;
    setDropdownLabel: (label: string) => void;
};

export interface FlyToPOIProps {
    circuitsData: CircuitProps[] | undefined;
    circuit: CircuitProps;
    map: Map | null;
    setDropdownLabel: (label: string) => void;
    setSelectedCircuit: (circuit: CircuitProps | undefined) => void;
}

export interface FlyToProps {
    position: LngLatLike;
    continent: string;
    map: Map | null;
    setSelectedCircuit: (circuit: CircuitProps | undefined) => void;
}

export interface GotoCircuitProps {
    circuitId: string;
    map: Map | null;
    setCircuit: (circuit: CircuitProps) => void;
    setContinent?: (continent: string) => void;
}

export interface GotoContinentProps {
    c: string;
    map: Map | null;
    setC: (circuit: CircuitProps | undefined) => void;
    setCon: (continent: string) => void;
}

export interface LoadCircuitLayersProps {
    data: CircuitDetailsProps;
    map: Map | null;
}

export interface ZoomToProps {
    position: LngLatLike;
    continent: string;
    map: Map | null;
    zoomLevel?: number;
}

export interface CreateMarkerProps {
    circuit: CircuitProps;
    map: Map | null;
    mapboxgl: typeof mapboxgl | mapboxgl;
}