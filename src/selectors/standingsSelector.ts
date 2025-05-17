import { RootState } from 'app/store';
import { createSelector } from 'reselect';
import { teamColors } from 'utils/teamColors';

export const selectState = (state: RootState) => state;

export const constructorsConfig = () => {
    const label = (team: string) => {
        const teamName = team.replace(/_/g, ' ');
        const capitalizedTeamName = teamName.charAt(0).toUpperCase() + teamName.slice(1);
        return capitalizedTeamName;
    };

    // const label = (team: string) =>
    return Object.keys(teamColors).reduce(
        (acc, team) => {
            acc[team] = {
                label: label(team),
                color: teamColors[team],
            };
            return acc;
        },
        {} as { [key: string]: { label: string; color: string } },
    );
};

/**
 * Creates a configuration object for F1 drivers based on team colors.
 *
 * @returns An object mapping team identifiers to configuration objects.
 * Each configuration object contains:
 * - constructor_id: The team identifier
 * - label: The team name for display purposes
 * - color: The color associated with the team from teamColors
 */
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

/**
 * Selects constructor standings from the Redux state and enhances them with team colors.
 *
 * This selector takes the constructor standings from the state and maps over each
 * standing to add fill and color properties based on the constructor_id.
 *
 * @param state - The root Redux state
 * @returns An array of constructor standings with added fill and color properties
 */
export const selectConstructorStandings = createSelector(
    [selectState],
    (state: RootState) => {
        const standings = state.standings.constructors;
        return standings.map((standing) => {
            return {
                ...standing,
                fill: teamColors[standing?.constructor_id],
                color: teamColors[standing?.constructor_id],
            };
        });
    }
);

export const selectDriverStandings = createSelector(
    [selectState],
    (state: RootState) => {
        const standings = state.standings.drivers;
        return standings.map((standing) => {
            return {
                ...standing,
                fill: teamColors[standing?.team_name],
                color: teamColors[standing?.team_name],
            };
        });
    }
);
