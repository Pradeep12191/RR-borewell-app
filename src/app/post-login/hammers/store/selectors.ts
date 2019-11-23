import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HammerState } from './reducers';


export const hammerStateSelector = createFeatureSelector<HammerState>('hammerState');

export const selectAllHammers = createSelector(
    hammerStateSelector,
    (state) => state.hammers
);

export const areHammersLoaded = createSelector(
    hammerStateSelector,
    state => state.allHammersLoaded
)