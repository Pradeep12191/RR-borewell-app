import { createAction, props } from '@ngrx/store';

export const ViewLoadAllHammers = createAction(
    '[View Hammer Component] Load All Hammers'
)

export const ViewAllHammersLoaded = createAction(
    '[View Hammer Component] All Hammers Loaded',
    props<{hammers: any[]}>()
)


export const ViewHammersResetLoad = createAction(
    '[Hammer Component] View Hammers Reset Load',
    props<{hammersLoaded: boolean}>()
)