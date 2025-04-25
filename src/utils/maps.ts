import { Geometry, Point, LineString, Polygon } from 'geojson';
import { LngLat, LngLatBounds } from 'mapbox-gl';

/**
 * Checks if the current bounding box is completely outside the target bounding box.
 *
 * @param currentBox - The bounding box to check.
 * @param targetBox - The bounding box to check against.
 * @returns `true` if the current bounding box is completely outside the target bounding box, `false` otherwise.
 */
export const isBoundingBoxOutside = (currentBox: LngLatBounds, targetBox: LngLatBounds): boolean => {
    if (!currentBox || !targetBox) {
        return false;
    }
    if (currentBox === targetBox) {
        return false;
    }
    if (!(currentBox instanceof LngLatBounds) || !(targetBox instanceof LngLatBounds)) {
        return false;
    }
    const currentMinLng = currentBox.getWest();
    const currentMinLat = currentBox.getSouth();
    const currentMaxLng = currentBox.getEast();
    const currentMaxLat = currentBox.getNorth();

    const targetMinLng = targetBox.getWest();
    const targetMinLat = targetBox.getSouth();
    const targetMaxLng = targetBox.getEast();
    const targetMaxLat = targetBox.getNorth();

    // we don't have valid bounding boxes, so we can't determine if they are outside
    if (currentMinLng === 0 || currentMinLat === 0 || currentMaxLng === 0 || currentMaxLat === 0) {
        return false;
    }
    if (targetMinLng === 0 || targetMinLat === 0 || targetMaxLng === 0 || targetMaxLat === 0) {
        return false;
    }

    // Check if the current bounding box is completely outside the target bounding box
    return (
        currentMinLng < targetMinLng || // current minLng is left of target minLng
        currentMinLat < targetMinLat || // current minLat is below target minLat
        currentMaxLng > targetMaxLng || // current maxLng is right of target maxLng
        currentMaxLat > targetMaxLat // current maxLat is above target maxLat
    );
};

/**
 * Checks if a given point is inside a specified bounding box.
 *
 * @param point - A tuple representing the longitude and latitude of the point.
 * @param boundingBox - An instance of LngLatBounds containing the bounding box coordinates.
 * @returns `true` if the point is inside the bounding box, `false` otherwise.
 */
export const isPointInsideBoundingBox = (point: LngLat, boundingBox: LngLatBounds): boolean => {
    if (!(boundingBox instanceof LngLatBounds)) {
        return false;
    }

    const minLng = boundingBox.getWest();
    const minLat = boundingBox.getSouth();
    const maxLng = boundingBox.getEast();
    const maxLat = boundingBox.getNorth();
    
    return (
        point.lng >= minLng && // point longitude is greater than or equal to min longitude
        point.lng <= maxLng && // point longitude is less than or equal to max longitude
        point.lat >= minLat && // point latitude is greater than or equal to min latitude
        point.lat <= maxLat // point latitude is less than or equal to max latitude
    );
};

/**
 * Retrieves the coordinates from a given geometry object.
 *
 * @param geometry - The geometry object from which to extract coordinates. 
 *                   It can be of type 'Point', 'LineString', or 'Polygon'.
 * @returns The coordinates of the geometry. The return type can be:
 *          - `number[]` for 'Point'
 *          - `number[][]` for 'LineString'
 *          - `number[][][]` for 'Polygon'
 *          - `undefined` if the geometry type is not recognized
 */
export function getCoordinates(
    geometry: Geometry,
): number[] | number[][] | number[][][] | undefined {
    if (geometry.type === 'Point') {
        return (geometry as Point).coordinates;
    } else if (geometry.type === 'LineString') {
        return (geometry as LineString).coordinates;
    } else if (geometry.type === 'Polygon') {
        return (geometry as Polygon).coordinates;
    }
    // Add more cases for other geometry types if needed
    return undefined;
}
