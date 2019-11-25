import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ViewHammersActions } from './action-types';
import { switchMap, map } from 'rxjs/operators';
import { HammersService } from '../../hammers.service';


@Injectable()
export class ViewHammersEffects {
    loadHammers$ = createEffect(() => this.actions$.pipe(
        ofType(ViewHammersActions.ViewLoadAllHammers),
        switchMap(() => this.hammersService.getHammersViewData()),
        map((hammers) => ViewHammersActions.ViewAllHammersLoaded({ hammers }))
    ))
    constructor(
        private actions$: Actions,
        private hammersService: HammersService
    ) {

    }
}