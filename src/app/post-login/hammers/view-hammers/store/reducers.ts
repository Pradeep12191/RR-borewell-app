import { allHammersLoaded } from '../../store/actions';
import { createReducer, on, Action } from '@ngrx/store';
import { ViewHammersActions } from './action-types';


export interface ViewHammerState {
    hammers: any[];
    allHammersLoaded: boolean;
}

export const intialState: ViewHammerState = {
    hammers: undefined,
    allHammersLoaded: false
}

const viewHammersReducer = createReducer(
    intialState,
    on(ViewHammersActions.ViewAllHammersLoaded, (state, action) => {
        return {
            ...state,
            hammers: action.hammers,
            allHammersLoaded: true
        }
    }),

    on(ViewHammersActions.ViewHammersResetLoad, (state, action) => {
        return {
            ...state,
            allHammersLoaded: action.hammersLoaded
        }
    })
);

export function reducer(state: ViewHammerState | undefined, action: Action) {
    return viewHammersReducer(state, action)
}