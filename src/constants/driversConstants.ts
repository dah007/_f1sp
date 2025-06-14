import { Driver } from '@/types/drivers';

export const itemTypes = {
    CARD: 'driver',
};

import { store } from '@/app/store';
import { driversApi } from '@/features/driversApi';
import { YEAR } from './constants';

export const selectDriversData = driversApi.endpoints.getDrivers.select(YEAR);

// Access the data from the store's state
const state = store.getState();
const driversResult = selectDriversData(state);

// The data is in driversResult.data
const drivers = driversResult?.data;
console.log('----------- drivers', drivers);

// const drivers = (state: { drivers: { drivers: Record<string, Driver> } }) => state.drivers.drivers;

// const drivers = useAppSelector(driverSelector);

export const DRIVERS: Driver[] = Array.isArray(drivers) ? drivers : [];
// export const DRIVERS = Object.keys(drivers).map((key) => drivers[key]);
export const DRIVERS_BY_ID = (drivers && typeof drivers === 'object' ? Object.keys(drivers) : []).reduce((acc, key) => {
    const driver = drivers?.[key as keyof typeof drivers];
    if (driver && typeof driver === 'object' && 'id' in driver) {
        acc[driver?.id as unknown as string] = driver as Driver;
    }
    return acc;
}, {} as Record<string, Driver>);
export const DRIVERS_BY_NAME = (drivers && typeof drivers === 'object' ? Object.keys(drivers) : []).reduce(
    (acc, key) => {
        const driver = drivers?.[key as keyof typeof drivers];
        if (driver && typeof driver === 'object' && 'name' in driver) {
            acc[driver.name] = driver as Driver;
        }
        return acc;
    },
    {} as Record<string, Driver>,
);
