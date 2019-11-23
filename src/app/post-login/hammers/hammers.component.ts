import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducer';
import { Observable } from 'rxjs';
import { Hammer } from './hammer.model';
import { selectAllHammers } from './store/selectors';
import { listStateTrigger } from '../../animations';

@Component({
    templateUrl: './hammers.component.html',
    styleUrls: ['./hammers.component.scss'],
    animations: [listStateTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HammersComponent implements OnInit {
    hammers$: Observable<Hammer[]>;
    hammers: Hammer[];
    constructor(
        private store: Store<AppState>,
        private cdr: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        this.store.pipe(select(selectAllHammers)).subscribe((hammers) => {
            setTimeout(() => {
                this.hammers = hammers;
                this.cdr.detectChanges();
            });
        })
    }
}