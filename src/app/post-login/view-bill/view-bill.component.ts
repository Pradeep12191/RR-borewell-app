import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';

@Component({
    templateUrl: 'view-bill.component.html',
    styleUrls: ['view-bill.component.scss']
})
export class ViewBillComponent implements OnDestroy {
    routeSubcsription: Subscription;
    bills;
    billDataSource: MatTableDataSource<any>;
    pipes = [
        { type: '4\'\'4', key: 'p_4Inch4Kg', count: '0', length: '0' },
        { type: '4\'\'6', key: 'p_4Inch6Kg', count: '0', length: '0' },
        { type: '5\'\'6', key: 'p_5Inch6Kg', count: '0', length: '0' },
        { type: '5\'\'8', key: 'p_5Inch8Kg', count: '0', length: '0' },
        { type: '7\'\'6', key: 'p_7Inch6Kg', count: '0', length: '0' },
        { type: '7\'\'8', key: 'p_7Inch8Kg', count: '0', length: '0' },
        { type: '8\'\'4', key: 'p_8Inch4Kg', count: '0', length: '0' },
        { type: '11\'\'4', key: 'p_11Inch4Kg', count: '0', length: '0' },
    ]
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '15' },
        { id: 'billNo', name: 'Bill Number', type: 'string', width: '70', isCenter: true },
        { id: 'more_details', name: '', type: 'toggle', width: '15' }
    ]
    constructor(
        private route: ActivatedRoute
    ) {
        this.route.data.subscribe(data => {
            this.bills = data.bills;
            this.billDataSource = new MatTableDataSource(data.bills);
        })
    }

    pipeAddedDisplay(pipe) {
        if(pipe){
            let start = pipe.start ? +pipe.start : 0;
            const end = pipe.end ? +pipe.end : 0;
            if (start === end) {
                return start;
            }
            return `(${start} - ${end})`;
        }
        return '0'
    }

    ngOnDestroy() {
        if (this.routeSubcsription) { this.routeSubcsription.unsubscribe(); }
    }
}