import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HammerState } from './reducers';


export const hammerStateSelector = createFeatureSelector<HammerState>('hammerState');

export const selectAllHammers = createSelector(
    hammerStateSelector,
    (state) => state.hammers
);

export const selectAllGodowns = createSelector(
    hammerStateSelector,
    state => state.godowns
)

export const areHammersLoaded = createSelector(
    hammerStateSelector,
    state => state.allHammersLoaded
)

export const selectCompanies = createSelector(
    hammerStateSelector,
    state => state.companies
)

export const areCompaniesLoaded = createSelector(
    hammerStateSelector,
    state => state.allCompaniesLoaded
)

export const selectLastHammerSerialNo = createSelector(
    hammerStateSelector,
    state => state.lastHammerSerialNo
)