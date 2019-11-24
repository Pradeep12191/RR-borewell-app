import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducer';
import { areCompaniesLoaded } from './store/selectors';
import { tap, filter, take, finalize, first } from 'rxjs/operators';
import { HammerActions } from './store/actions-types';


export class HammerCompaniesResolver implements Resolve<any> {
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
            select(areCompaniesLoaded),
            tap(companiesLoaded => {
                if (!this.loading && !companiesLoaded) {
                    this.loading = true;
                    this.store.dispatch(HammerActions.loadCompanies())
                }
            }),
            filter(companiesLoaded => companiesLoaded),
            first(),
            finalize(() => this.loading = false)
        )
    }
}