import { Component } from '@angular/core';
import { PipeData } from '../../../models/PipeData';
import { Column } from '../../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './pipe-data.component.html',
    styleUrls: ['./pipe-data.component.scss']
})
export class PipeDataComponent {
    pipes: PipeData[];
    pipeDataSource: MatTableDataSource<any>;
    public columns: Column[] = [
        { id: 'S.No.', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'billno', name: 'Bill No', type: 'string', width: '15', isCenter: true },
        { id: 'serial_no', name: 'Serial No', type: 'string', width: '30', isCenter: true },
        { id: 'vehicle_no', name: 'Vehicle No', type: 'string', width: '25', isCenter: true }
    ]
    constructor(
        private route: ActivatedRoute
    ) {
        this.route.data.subscribe((data) => {
            this.pipes = data.pipes;
            this.pipeDataSource = new MatTableDataSource(this.pipes)
        })
    }
}