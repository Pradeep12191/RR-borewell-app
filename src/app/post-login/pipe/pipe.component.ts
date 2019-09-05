import { Component } from '@angular/core';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AddPipeDialogComponent } from './add-pipe-dialog/add-pipe-dialog.component';

@Component({
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss']
})
export class PipeComponent {

    pipeDataSource: MatTableDataSource<any>;
    public columns: Column[] = [
        { id: 'S.No.', name: 'COLUMN.SERIAL_NO', type: 'index', width: '15' },
        { id: 'type', name: 'Type', type: 'string', width: '45' },
        { id: 'count', name: 'No. of Pipes Available', type: 'string', width: '40', isCenter: true },
    ]
    pipes = [
        { type: '11\'\'Inch 4Kg', count: '20' },
        { type: '8\'\'Inch 4Kg', count: '20' },
        { type: '7\'\'Inch 8Kg', count: '20' },
        { type: '7\'\'Inch 6Kg', count: '20' },
        { type: '5\'\'Inch 8Kg', count: '20' },
        { type: '5\'\'Inch 6Kg', count: '20' },
        { type: '4\'\'Inch 6Kg', count: '20' },
        { type: '4\'\'Inch 4Kg', count: '20' }
    ]
    constructor(
        private dialog: MatDialog
    ) {
        this.pipeDataSource = new MatTableDataSource(this.pipes)
    }

    addPipe() {
        const dialogRef = this.dialog.open(AddPipeDialogComponent, {
            width: '70vw'
        });
        dialogRef.afterClosed().subscribe((pipeList) => {
            console.log(pipeList);
        })
    }
}