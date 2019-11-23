import { Hammer } from '../hammer.model';
import { createReducer, on } from '@ngrx/store';
import { HammerActions } from './actions-types';



export interface HammerState {
    hammers: Hammer[];
    allHammersLoaded: boolean;
}

export const initialHammerState: HammerState = {
    hammers: [],
    allHammersLoaded: false
}

export const hammerReducer = createReducer(
    initialHammerState,
    on(HammerActions.allHammersLoaded, (state, action) => {
        return {
            ...state,
            hammers: action.hammers,
            allHammersLoaded: true
        }
    })
)