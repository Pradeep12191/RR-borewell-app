import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HammersService } from '../hammers.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HammerActions } from './actions-types';
import { switchMap, map, tap, finalize, catchError } from 'rxjs/operators';
import { LoaderService } from '../../../services/loader-service';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HammerEffects {

    loadHammer$ = createEffect(() => this.actions$.pipe(
        ofType(HammerActions.loadAllHammers),
        switchMap((action) => {
            let godowns$ = this.hammerService.getGodowns();
            if (action.godown_id) {
                godowns$ = of(null);
            }
            return godowns$.pipe(
                switchMap((godowns) => {
                    let godown_id = action.godown_id;
                    if (godowns) {
                        godown_id = godowns[0].godown_id;
                    }
                    return this.hammerService.getAll(godown_id).pipe(
                        map(hammers => {
                            return { godowns, hammers }
                        })
                    );
                })
            )
        })
        ,
        switchMap(({ hammers, godowns }) => [
            HammerActions.allHammersLoaded({ hammers, godowns }),
            HammerActions.closeDialog()
        ])
    ))

    loadLastHammerSerialNo$ = createEffect(() => this.actions$.pipe(
        ofType(HammerActions.loadLastHammerSerial),
        switchMap((_) => this.hammerService.getLastHammerSerial().pipe(
            finalize(() => this.loader.hideSaveLoader()),
        )),
        map(lastHammerSerialNo => HammerActions.setLastHammerSerial({ lastHammerSerialNo })),
    ));

    loadCompanies$ = createEffect(() => this.actions$.pipe(
        ofType(HammerActions.loadCompanies),
        switchMap((_) => this.hammerService.getCompanies()),
        map((companies) => HammerActions.allCompaniesLoaded({ companies }))
    ));

    addCompany$ = createEffect(() => this.actions$.pipe(
        ofType(HammerActions.postCompany),
        switchMap((action) =>
            this.hammerService.addCompany(action.company)
                .pipe(
                    map(company => HammerActions.addCompany({ company })),
                    catchError(() => of(HammerActions.errorAddingCompany()))
                )),
    ));

    addHammers$ = createEffect(() => this.actions$.pipe(
        ofType(HammerActions.postHammers),
        tap(() => this.loader.showSaveLoader('Saving Hammer ...')),
        switchMap((action) => this.hammerService.saveHammer(action.hammers).pipe(
            finalize(() => this.loader.hideSaveLoader())
        )),
        map((response) => HammerActions.updateLastHammerSerial({ lastHammerSerialNo: response }))
    ))

    constructor(
        private hammerService: HammersService,
        private actions$: Actions,
        private loader: LoaderService,
        private toastr: ToastrService
    ) {

    }
}