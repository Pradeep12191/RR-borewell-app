import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HammersService } from '../hammers.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HammerActions } from './actions-types';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class HammerEffects {

    loadHammer$ = createEffect(() => this.actions$.pipe(
        ofType(HammerActions.loadAllHammers),
        switchMap((_) => this.hammerService.getGodowns().pipe(
            switchMap((godowns) => {
                const godown_id = godowns[0].godown_id;
                return this.hammerService.getAll(godown_id);
            })
        )),
        map(hammers => HammerActions.allHammersLoaded({ hammers }))
    ))

    constructor(
        private hammerService: HammersService,
        private actions$: Actions
    ) {

    }
}