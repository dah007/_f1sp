import { RouteProps } from '@/components/CustomLink';

const base = '';
const graphql = 'graphql/';
const rest = 'rest/';

export const BASE_URL = base;
export const GRAPHQL_URL = `${base}/data-api/${graphql}`;
export const REST_URL = `${base}/data-api/${rest}`;

/** @deprecated */
export const F1SP_BASE_DB_URL = BASE_URL;

export const BUTTON_CLASSES = 'cursor-pointer bg-zinc-300 dark:bg-zinc-800';
// 'border-2 border-gray-300 bg-sky-950 hover:bg-sky-600 text-white hover:text-black cursor-pointer';

export const CIRCUIT_TYPES = {
    RACE: 'Race Circuit',
    ROAD: 'Road Circuit',
    STREET: 'Street Circuit',
}

export const DEBUG = import.meta.env.VITE_DEBUG;
export const DESCRIPTION = import.meta.env.VITE_DESCRIPTION;

export const ENGINE_TYPES = {
    NATURALLY_ASPIRATED: 'Naturally Aspirated',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid',
    TURBOCHARGED: 'Turbocharged',
    SUPERCHARGED: 'Supercharged',
    UNKNOWN: 'Unknown',
};

export const FONT_SIZE = {
    'text-sm': 'text-sm',
    'text-md': 'text-md',
    'text-lg': 'text-lg',
};

export const FULL_ROW_HEIGHT = 'lg:h-[40vh] md:h-[25vh] h-[23vh]';

export const MENU: RouteProps[] = [
    {
        parent: { path: '', label: '' },
        path: '/',
        label: 'Home',
        hidden: true,
    },
    {
        parent: { path: '', label: '' },
        path: 'vote',
        label: 'Vote',
    },
    {
        parent: { path: '', label: '' },
        path: 'leaderboard',
        label: 'Leaderboard',
    },
    {
        parent: { path: '', label: '' },
        path: 'drivers',
        label: 'Drivers',
        hidden: false,
    },
    {
        parent: { path: '', label: '' },
        path: 'driver',
        label: 'Driver',
        hidden: true,
    },
    {
        parent: { path: '', label: '' },
        path: 'races',
        label: 'Races',
    },
    {
        parent: { path: '', label: '' },
        path: 'race',
        label: 'Race',
        hidden: true,
    },
    {
        parent: { path: '', label: '' },
        path: 'constructors',
        label: 'Constructors',
    },
    {
        parent: { path: '', label: '' },
        path: 'seasons',
        label: 'Seasons',
    },
    {
        parent: { path: '', label: '' },
        path: 'standings',
        label: 'Standings',
    },
    {
        parent: { path: '', label: '' },
        path: 'circuits',
        label: 'Circuits',
    },
];

export const SELECT_CLASSES = 'select bg-zinc-300 dark:bg-zinc-800';

export const SITE_NAME: string = import.meta.env.VITE_SITE_NAME;

export type FontSizeKeys = keyof typeof FONT_SIZE;

export const YEAR = new Date().getFullYear();
