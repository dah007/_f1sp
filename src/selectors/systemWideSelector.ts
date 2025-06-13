import { RootState } from '@/app/store';
import { createSelector } from '@reduxjs/toolkit';

const selectState = (state: RootState) => state;

/**
 * Selects the system-wide state from the Redux store.
 *
 * This selector retrieves the entire system-wide state, which includes
 * properties like lastCrumb, lastSeason, loading, selectedYear, and maxYear.
 *
 * @param state - The root Redux state
 * @returns The system-wide state object
 */

/**
 * Selects the error state from the system-wide state.
 * @param state - The root Redux state
 * @returns The error state as a boolean
 */
export const selectError = createSelector([selectState], (state: RootState) => state.systemWide.error);

/**
 * Selects the system-wide state from the Redux store.
 *
 * @param state - The root Redux state
 * @returns The system-wide state
 */
export const selectSystemWide = createSelector([selectState], (state: RootState) => state.systemWide);
/**
 * Selects the last breadcrumb from the system-wide state.
 *
 * @param state - The root Redux state
 * @returns The last breadcrumb string
 */
export const selectLastCrumb = createSelector([selectState], (state: RootState) => state.systemWide.lastCrumb);
/**
 * Selects the last season year from the system-wide state.
 *
 * @param state - The root Redux state
 * @returns The last season year as a number
 */
export const selectLastSeasonYear = createSelector([selectState], (state: RootState) => state.systemWide.lastSeason);
/**
 * Selects the loading state from the system-wide state.
 *
 * @param state - The root Redux state
 * @returns The loading state as a boolean
 */
export const selectLoading = createSelector([selectState], (state: RootState) => state.systemWide.loading);
/**
 * Selects the selected year from the system-wide state.
 *
 * @param state - The root Redux state
 * @returns The selected year as a number
 */
export const selectSelectedYear = createSelector([selectState], (state: RootState) => state.systemWide.selectedYear);
/**
 * Selects the maximum year from the system-wide state.
 *
 * @param state - The root Redux state
 * @returns The maximum year as a number
 */
export const selectMaxYear = createSelector([selectState], (state: RootState) => state.systemWide.raceMaxYear);
