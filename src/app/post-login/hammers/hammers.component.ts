import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducer';
import { Observable, Subscription, noop } from 'rxjs';
import { Hammer } from './hammer.model';
import { selectAllHammers, selectAllGodowns } from './store/selectors';
import { listStateTrigger } from '../../animations';
import { Godown } from '../pipe/Godown';
import { ConfigService } from '../../services/config.service';
import { LoaderService } from '../../services/loader-service';
import { HammersService } from './hammers.service';
import { HammerActions } from './store/actions-types';
import { Actions, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddHammerDialogComponent } from './add-hammer-dialog/add-hammer-dialog.component';
import { HammerSize } from './hammer-size.model';
import { Router } from '@angular/router';

@Component({
    templateUrl: './hammers.component.html',
    styleUrls: ['./hammers.component.scss'],
    animations: [listStateTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HammersComponent implements OnInit, OnDestroy {
    hammers$: Observable<HammerSize[]>;
    godowns$: Observable<Godown[]>;
    hammers: HammerSize[];
    godowns: Godown[];
    godownSelectDisabled = false;
    selectedGodown;
    appearance;
    hammerSelectSubscription: Subscription;
    godownSelectSubscription: Subscription;
    actionsSubscription: Subscription;
    constructor(
        private store: Store<AppState>,
        private cdr: ChangeDetectorRef,
        private config: ConfigService,
        private loader: LoaderService,
        private actions: Actions,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnInit() {
        this.hammerSelectSubscription = this.store.pipe(select(selectAllHammers)).subscribe((hammers) => {
            setTimeout(() => {
                this.hammers = hammers;
                this.cdr.detectChanges();
            });
        });

        this.godownSelectSubscription = this.store.pipe(select(selectAllGodowns)).subscribe((godowns) => {
            this.godowns = godowns;
            this.selectedGodown = godowns[0];
            this.cdr.detectChanges();
        });

        this.actionsSubscription = this.actions.pipe(
            ofType(HammerActions.setLastHammerSerial),
            tap(() => {
                this.dialog.open(AddHammerDialogComponent, {
                    width: '60vw',
                    position: { top: '0px' },
                    maxHeight: '100vh',
                    height: '100vh',
                    disableClose: true,
                    data: {
                        selectedGodown: this.selectedGodown
                    }
                })
            })
        ).subscribe(noop)
    }

    ngOnDestroy() {
        if (this.hammerSelectSubscription) { this.hammerSelectSubscription.unsubscribe() };
        if (this.godownSelectSubscription) { this.godownSelectSubscription.unsubscribe() };
        if (this.actionsSubscription) { this.actionsSubscription.unsubscribe() };
    }

    viewHammerData(hammer: Hammer) {
        this.router.navigate(['postlogin/viewHammerData', hammer.size, hammer.type])
    }

    openAddHammer() {
        this.loader.showSaveLoader('Loading ...');
        this.store.dispatch(HammerActions.loadLastHammerSerial());
    }


}