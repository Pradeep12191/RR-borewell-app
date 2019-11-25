import { Component, OnDestroy, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Column } from '../../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/reducer';
import { viewSelectAllHammers } from './store/selectors';
import { shareReplay } from 'rxjs/operators';

@Component({
    templateUrl: './view-hammers.component.html',
    styleUrls: ['./view-hammers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewHammersComponent implements OnDestroy, OnInit {
    routeDataSubscription: Subscription;
    hammers: any[];
    hammerDataSource: MatTableDataSource<any>;
    hammers$: Observable<any[]>;
    storeSelectSubscription: Subscription;
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'bit_type', name: 'Hammer Size', type: 'string', width: '15', isCenter: false, style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'company_name', name: 'Company', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'quantity', name: 'Quantity', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'date', name: 'Date', type: 'string', width: '25', style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'more_details', name: 'Collapse All', type: 'toggle', width: '20', isCenter: true }
    ];
    constructor(
        private store: Store<AppState>,
    ) {

    }

    ngOnInit() {
        this.hammers$ = this.store.pipe(select(viewSelectAllHammers), shareReplay())
        this.storeSelectSubscription = this.store.pipe(select(viewSelectAllHammers)).subscribe((hammers) => {
            this.hammers = [...hammers].map(h => {
                return {...h, expand: false}
            })
            this.hammerDataSource = new MatTableDataSource(this.hammers);
            // this.cdr.detectChanges();
        })
    }

    ngOnDestroy() {
        if (this.storeSelectSubscription) { this.storeSelectSubscription.unsubscribe(); }
    }

}