import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RpmEntrySheet } from '../../models/RpmEntrySheet';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';


@Component({
    templateUrl: './rpm-entry-report.component.html',
    styleUrls: ['./rpm-entry-report.component.scss']
})
export class RpmEntryReportComponent implements OnDestroy {
    routeDataSubcription: Subscription;
    entries: RpmEntrySheet[];
    entriesDatasource: MatTableDataSource<RpmEntrySheet>;
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'billNo', name: 'Bill Number', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'godowntype1', name: 'Godown', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'company1', name: 'Company', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'date', name: 'Date', type: 'string', width: '25', style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'more_details', name: 'Collapse All', type: 'toggle', width: '20', isCenter: true }
    ];
    constructor(
        private route: ActivatedRoute
    ) {
        this.routeDataSubcription = this.route.data.subscribe((entries: RpmEntrySheet[]) => {

        })
    }

    ngOnDestroy() {
        if (this.routeDataSubcription) { this.routeDataSubcription.unsubscribe(); }
    }
}