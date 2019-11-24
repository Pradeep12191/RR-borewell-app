import { createAction, props } from '@ngrx/store';
import { Godown } from '../../pipe/Godown';
import { Company } from '../../bits/Company';
import { HammerSize } from '../hammer-size.model';


export const loadAllHammers = createAction(
    '[Hammers Resolver] Load All Hammers',
    props<{godown_id?: string}>()
)

export const allHammersLoaded = createAction(
    '[Hammers Reolver] All Hammers Loaded',
    props<{hammers: HammerSize[], godowns: Godown[]}>()
)

export const loadCompanies = createAction(
    '[Hammer Companies Resolver] Load Hammer Companies',
)

export const allCompaniesLoaded = createAction(
    '[Hammers Companies Resolver] All Companies Loaded',
    props<{companies: Company[]}>()
)

export const loadLastHammerSerial = createAction(
    '[Add Hammer Dialog] Load Last Hammer Serial'
)

export const setLastHammerSerial = createAction(
    '[Add Hammer Dialog] Set Last Hammer Serial',
    props<{lastHammerSerialNo: number}>()
);

export const updateLastHammerSerial = createAction(
    '[Add Hammer Dialog] Update Last Hammer Serial',
    props<{lastHammerSerialNo: number}>()
);

export const postCompany = createAction(
    '[Add Hammer Company Dialog] Post Company',
    props<{company: Company}>()
)

export const addCompany = createAction(
    '[Add Hammer Company Dialog] Add Company',
    props<{company: Company}>()
)

export const errorAddingCompany = createAction(
    '[Add Hammer Company Dialog] Error'
)

export const postHammers = createAction(
    '[Add Hammer Dialog] Post Hammers',
    props<{hammers: any}>()
);

export const closeDialog = createAction(
    '[Add Hammer Dialog] Close Dialog'
);