import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/reducer';
import { areViewHammersLoaded } from './store/selectors';
import { tap, filter, first, finalize } from 'rxjs/operators';
import { ViewHammersActions } from './store/action-types';

@Injectable()
export class ViewHammersResolver implements Resolve<any> {
    loading = false;
    constructor(
        private store: Store<AppState>
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return this.store.pipe(
            select(areViewHammersLoaded),
            tap((hammersLoaded) => {
                if (!hammersLoaded && !this.loading) {
                    this.loading = true;
                    this.store.dispatch(ViewHammersActions.ViewLoadAllHammers())
                }
            }),
            filter(hammersLoaded => hammersLoaded),
            first(),
            finalize(() => this.loading = false)
        )
    }
}