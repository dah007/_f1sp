import { TNamedObject } from '../types';

const timeToMinutes = (time: string): number => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
};

export const quickestTimeObj = <T extends TNamedObject<string>>(times: T[], field: string): T => {
    return times.reduce((minObj, currentObj) => {
        return timeToMinutes(currentObj[field]) < timeToMinutes(minObj[field]) ? currentObj : minObj;
    });
};
