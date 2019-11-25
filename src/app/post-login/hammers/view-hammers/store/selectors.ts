import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ViewHammerState } from './reducers';


const viewHammersStateSelector = createFeatureSelector<ViewHammerState>('viewHammer');

export const viewSelectAllHammers = createSelector(
    viewHammersStateSelector,
    state => state.hammers
)

export const areViewHammersLoaded = createSelector(
    viewHammersStateSelector,
    (state) => state.allHammersLoaded
)