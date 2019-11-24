import { createReducer, on, State, Action } from '@ngrx/store';
import { HammerActions } from './actions-types';
import { Godown } from '../../pipe/Godown';
import { Company } from '../../bits/Company';
import { HammerSize } from '../hammer-size.model';



export interface HammerState {
    hammers: HammerSize[];
    godowns: Godown[];
    companies: Company[];
    lastHammerSerialNo: number;
    allHammersLoaded: boolean;
    allCompaniesLoaded: boolean;
}

export const initialHammerState: HammerState = {
    hammers: [],
    godowns: [],
    companies: [],
    lastHammerSerialNo: undefined,
    allHammersLoaded: false,
    allCompaniesLoaded: false
}

export const hammerReducer = createReducer(
    initialHammerState,
    on(HammerActions.allHammersLoaded, (state, action) => {
        return {
            ...state,
            hammers: action.hammers,
            godowns: action.godowns ? action.godowns: state.godowns,
            allHammersLoaded: true
        }
    }),

    on(HammerActions.setLastHammerSerial, HammerActions.updateLastHammerSerial, (state, action) => {
        return {
            ...state,
            lastHammerSerialNo: action.lastHammerSerialNo
        }
    }),

    on(HammerActions.allCompaniesLoaded, (state, action) => {
        return {
            ...state,
            companies: action.companies,
            allCompaniesLoaded: true
        }
    }),

    on(HammerActions.addCompany, (state, action) => {
        const companies = [...state.companies, action.company];
        return {
            ...state,
            companies
        }
    })
)

export function reducer(state: HammerState | undefined, action: Action) {
    return hammerReducer(state, action);
  }