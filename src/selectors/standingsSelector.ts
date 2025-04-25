import { RootState } from 'app/store';
import { teamColors } from 'utils/teamColors';

export const constructorsConfig = () => {
    return Object.keys(teamColors).reduce((acc, team) => {
        acc[team] = {
            label: team,
            color: teamColors[team]
        };
        return acc;
    }, {} as { [key: string]: { label: string; color: string } });
};

export const driversConfig = () => {
    return Object.keys(teamColors).reduce((acc, team) => {
        acc[team] = {
            label: team,
            color: teamColors[team]
        };
        return acc;
    }, {} as { [key: string]: { label: string; color: string } });
}

export const selectConstructorStandings = (state: RootState) => {
    const standings = state.standings.constructors;

    return standings.map((standing) => {
        return {
            ...standing,
            fill: teamColors[standing?.constructor_id],
            color: teamColors[standing?.constructor_id],
        };
    });
};

export const selectDriverStandings = (state: RootState) => {
    const standings = state.standings.drivers;
    return standings.map((standing) => {
        return {
            ...standing,
            fill: teamColors[standing?.driver_id],
            color: teamColors[standing?.driver_id],
        };
    });
};
