import { Component } from '@angular/core';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource, MatDialog, MatSelectChange } from '@angular/material';
import { AddPipeDialogComponent } from './add-pipe-dialog/add-pipe-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { map, finalize } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { FADE_IN_ANIMATION } from '../../animations';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss'],
    animations: [FADE_IN_ANIMATION]
})
export class PipeComponent {

    pipeDataSource: MatTableDataSource<any>;
    public columns: Column[] = [
        { id: 'S.No.', name: 'COLUMN.SERIAL_NO', type: 'index', width: '15' },
        { id: 'type', name: 'Type', type: 'string', width: '45' },
        { id: 'count', name: 'No. of Pipes Available', type: 'string', width: '40', isCenter: true },
    ]
    public godownTypes = [];
    public selectedGodown;
    public godownSelectDisabled;
    loading;
    // pipes = [
    //     { type: '11\'\'Inch 4Kg', count: '20' },
    //     { type: '8\'\'Inch 4Kg', count: '20' },
    //     { type: '7\'\'Inch 8Kg', count: '20' },
    //     { type: '7\'\'Inch 6Kg', count: '20' },
    //     { type: '5\'\'Inch 8Kg', count: '20' },
    //     { type: '5\'\'Inch 6Kg', count: '20' },
    //     { type: '4\'\'Inch 6Kg', count: '20' },
    //     { type: '4\'\'Inch 4Kg', count: '20' }
    // ]

    pipes = [
        { type: '4\'\'Inch 4Kg', key: 'p_4Inch4Kg1', count: '0' },
        { type: '4\'\'Inch 6Kg', key: 'p_4Inch6Kg1', count: '0' },
        { type: '5\'\'Inch 6Kg', key: 'p_5Inch6Kg1', count: '0' },
        { type: '5\'\'Inch 8Kg', key: 'p_5Inch8Kg1', count: '0' },
        { type: '7\'\'Inch 6Kg', key: 'p_7Inch6Kg1', count: '0' },
        { type: '7\'\'Inch 8Kg', key: 'p_7Inch8Kg1', count: '0' },
        { type: '8\'\'Inch 4Kg', key: 'p_8Inch4Kg1', count: '0' },
        { type: '11\'\'Inch 4Kg', key: 'p_11Inch4Kg1', count: '0' },
    ]
    appearance;
    pipeUrl;

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService,
        private toastr: ToastrService
    ) {
        this.appearance = this.config.getConfig('formAppearance')
        this.pipeUrl = this.config.getAbsoluteUrl('pipeCount') + '/' + this.auth.userid;
        this.route.data.subscribe((data) => {
            this.godownTypes = data.pipeData.goDowns;
            this.selectedGodown = data.pipeData.godownId;
            const pipes = data.pipeData.pipes;
            this.pipes.forEach(pipeObj => {
                pipeObj.count = pipes[pipeObj.key] ? pipes[pipeObj.key] : 0
            });
            this.pipeDataSource = new MatTableDataSource(this.pipes)
        })
    }

    public godownChange($event: MatSelectChange) {
        this.loading = true;
        this.godownSelectDisabled = true;
        const pipeUrl = this.pipeUrl + '/' + $event.value;
        this.http.get(pipeUrl).pipe(finalize(() => {
            this.loading = false;
            this.godownSelectDisabled = false;
        })).subscribe(pipes => {
            this.pipes.forEach(pipeObj => {
                pipeObj.count = pipes[pipeObj.key] ? pipes[pipeObj.key] : 0
            });
            this.pipeDataSource = new MatTableDataSource(this.pipes);
        }, (err) => {
            if (err) {
                this.toastr.error('Error while Fetching Pipe Information', null, { timeOut: 2000 })
            }
        });
    }

    addPipe() {
        const dialogRef = this.dialog.open(AddPipeDialogComponent, {
            width: '70vw',
            data: {
                selectedGodownId: this.selectedGodown,
                godownTypes: this.godownTypes,
                pipes: this.pipes
            }
        });
        dialogRef.afterClosed().subscribe((pipes) => {
            if (pipes) {
                this.pipes.forEach(pipeObj => {
                    pipeObj.count = pipes[pipeObj.key] ? pipes[pipeObj.key] : 0
                });
                this.pipeDataSource = new MatTableDataSource(this.pipes);
                if (pipes.godown_id) {
                    this.selectedGodown = pipes.godown_id
                }
            }


        })
    }
}