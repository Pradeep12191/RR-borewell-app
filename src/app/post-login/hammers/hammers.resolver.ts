import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducer';
import { areHammersLoaded } from './store/selectors';
import { tap, filter, take, finalize, first } from 'rxjs/operators';
import { HammerActions } from './store/actions-types';


export class HammersResolver implements Resolve<any> {
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
            select(areHammersLoaded),
            tap(hammersLoaded => {
                if (!this.loading && !hammersLoaded) {
                    this.loading = true;
                    this.store.dispatch(HammerActions.loadAllHammers())
                }
            }),
            filter(hammersLoaded => hammersLoaded),
            first(),
            finalize(() => this.loading = false)
        )
    }
}