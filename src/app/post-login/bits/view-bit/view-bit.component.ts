import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BitData } from './BitData';
import { Column } from '../../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';

@Component({
    templateUrl: './view-bit.component.html',
    styleUrls: ['././view-bit.component.scss']
})
export class ViewBitComponent implements OnDestroy {
    routeDataSubscription: Subscription;
    bits: BitData[];
    bitDataSource: MatTableDataSource<BitData>;
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'bit_type', name: 'Bit Size', type: 'string', width: '20', isCenter: false, style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'company_name', name: 'Company', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'quantity', name: 'Quantity', type: 'string', width: '10', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'date', name: 'Date', type: 'string', width: '25', style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'more_details', name: 'Collapse All', type: 'toggle', width: '20', isCenter: true }
    ];
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.routeDataSubscription = this.route.data.subscribe(({ bits }) => {
            this.bits = bits;
            this.bitDataSource = new MatTableDataSource(this.bits);
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) {
            this.routeDataSubscription.unsubscribe()
        }
    }

    backToBits() {
        this.router.navigate(['../'], { relativeTo: this.route })
    }
}