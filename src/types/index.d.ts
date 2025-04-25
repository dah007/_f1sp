export type Location = {
    country: string;
    lat: number;
    locality: string;
    long: number;
};

export interface TNamedObject<T> {
    name: string;
    value: T;
}

interface RouteType extends SimpleRouteType {
    element: JSX.Element;
    hideInMenu?: boolean;
}


export interface AdditionalFiltersYearProps {
    selectedYear: string;
    onFilterTextBoxChanged: (event: React.FormEvent<HTMLInputElement>) => void;
}

/**
 * interface routerType
 * @param children An array of child routes
 * @param element JSX element to display
 * @param path Path to the route
 * @param title Route Title -- shows in browser title bar and
 */
export interface RouterType {
    children?: routerType[];
    element: JSX.Element;
    path: string;
    title: string;
}

/**
 * Represents a simple route type used in the application.
 *
 * @deprecated
 * 
 * @property {SimpleRouteType[]} [children] - An optional array of child routes.
 * @property {string} label - The label for the route.
 * @property {SimpleRouteType} [parent] - An optional parent route.
 * @property {string} path - The path for the route.
 * @property {string[]} [pathVars] - An optional array of path variables.
 */
export type SimpleRouteType = {
    children?: SimpleRouteType[];
    label: string;
    parent?: SimpleRouteType;
    path: string;
    pathVars?: string[];
};

/**
 * Represents an object with string keys and values of type `T`.
 *      Making this a generic type allows for the values to be of any type.
 *
 * @template T - The type of the values in the object.
 */
export interface TNamedObject<T> {
    [key: string]: T;
}
