import type { GeoJsonData } from '@/types';
import { getCode } from 'country-list';
import { capitalizeFirstLetter } from './string';

export const getCounty2LetterCode = (country: string) => {
    if (!country) return;

    const ukException = country.toLowerCase() === 'united-kingdom' ? 'GB' : '';
    const ozzieException = country.toLowerCase() === 'new-zealand' ? 'NZ' : ukException;

    const saException = country.toLowerCase() === 'south-africa' ? 'ZA' : ozzieException;

    // ? AND of course, we need a US exception as well
    const finalException = country.toLowerCase() === 'united-states-of-america' ? 'US' : saException;

    return finalException || getCode(capitalizeFirstLetter(country));
};

export const getGeoJsonData = async (circuitId: string): Promise<GeoJsonData | null> => {
    if (!circuitId) {
        console.error('No circuit ID provided to getGeoJsonData');
        return null;
    }
    
    try {
        const response = await fetch(`/assets/tracks/${circuitId}.geojson`);
        if (!response.ok) {
            console.error(`Error fetching GeoJSON for circuit ${circuitId}:`, response.statusText);
            return null;
        }
        
        const data: GeoJsonData = await response.json();
        
        // Validate the GeoJSON data structure
        if (!data || !data.type || !data.features || !Array.isArray(data.features)) {
            console.error(`Invalid GeoJSON data for circuit ${circuitId}`);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error(`Error fetching GeoJSON for circuit ${circuitId}:`, error);
        return null;
    }
};