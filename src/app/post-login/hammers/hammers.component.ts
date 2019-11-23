import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducer';
import { Observable } from 'rxjs';
import { Hammer } from './hammer.model';
import { selectAllHammers } from './store/selectors';
import { listStateTrigger } from '../../animations';

@Component({
    templateUrl: './hammers.component.html',
    styleUrls: ['./hammers.component.scss'],
    animations: [listStateTrigger]
})
export class HammersComponent implements OnInit {
    hammers$: Observable<Hammer[]>;
    constructor(
        private store: Store<AppState>
    ) {

    }

    ngOnInit() {
        this.hammers$ = this.store.pipe(select(selectAllHammers))
    }
}