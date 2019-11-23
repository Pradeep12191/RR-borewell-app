import { createAction, props } from '@ngrx/store';
import { Hammer } from '../hammer.model';


export const loadAllHammers = createAction(
    '[Hammers Resolver] Load All Hammers',
)

export const allHammersLoaded = createAction(
    '[Hammers Reolver] All Hammers Loaded',
    props<{hammers: Hammer[]}>()
)