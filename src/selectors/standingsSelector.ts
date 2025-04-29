import { RootState } from 'app/store';
import { teamColors } from 'utils/teamColors';

export const constructorsConfig = () => {
    return Object.keys(teamColors).reduce(
        (acc, team) => {
            acc[team] = {
                label: team,
                color: teamColors[team],
            };
            return acc;
        },
        {} as { [key: string]: { label: string; color: string } },
    );
};

export const driversConfig = () => {
    return Object.keys(teamColors).reduce(
        (acc, team) => {
            acc[team] = {
                constructor_id: team,
                label: team,
                color: teamColors[team],
            };
            return acc;
        },
        {} as { [key: string]: { label: string; color: string; constructor_id: string } },
    );
};

console.log('teamColors', teamColors);
console.log('driversConfig', driversConfig());

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
        console.log('standing', standing, {
            fill: teamColors[standing?.team_name],
            color: teamColors[standing?.team_name],
        });
        return {
            ...standing,
            fill: teamColors[standing?.team_name],
            color: teamColors[standing?.team_name],
        };
    });
};
