import { Component } from '@angular/core';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource, MatDialog, MatSelectChange } from '@angular/material';
import { AddPipeDialogComponent } from './add-pipe-dialog/add-pipe-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map, finalize } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { FADE_IN_ANIMATION } from '../../animations';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../services/app.service';

@Component({
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss'],
    animations: [FADE_IN_ANIMATION]
})
export class PipeComponent {

    pipeDataSource: MatTableDataSource<any>;
    public columns: Column[] = [
        { id: 'S.No.', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'type', name: 'Type', type: 'string', width: '15', isCenter: true },
        { id: 'count', name: 'No. of Pipe Length', type: 'string', width: '30', isCenter: true },
        { id: 'length', name: 'Feet', type: 'string', width: '25', isCenter: true },
        { id: 'assignVehicle', name: 'Assign Vehicle', type: 'iconButton', width: '15', isCenter: true, action: 'ASSIGN_VEHICLE', iconName: 'directions_car' },
        { id: 'viewPipeData', name: 'View Pipe Data', type: 'iconButton', isCenter: true, width: '15', action: 'VIEW_PIPE_DATA', iconName: 'arrow_forward' },
    ]
    public godownTypes = [];
    public selectedGodown;
    public godownSelectDisabled;
    loading;

    pipes = [
        { type: '4\'\'4 kg', key: 'p_4Inch4Kg1', count: '0', length: '0' },
        { type: '4\'\'6 kg', key: 'p_4Inch6Kg1', count: '0', length: '0' },
        { type: '5\'\'6 kg', key: 'p_5Inch6Kg1', count: '0', length: '0' },
        { type: '5\'\'8 kg', key: 'p_5Inch8Kg1', count: '0', length: '0' },
        { type: '7\'\'6 kg', key: 'p_7Inch6Kg1', count: '0', length: '0' },
        { type: '7\'\'8 kg', key: 'p_7Inch8Kg1', count: '0', length: '0' },
        { type: '8\'\'4 kg', key: 'p_8Inch4Kg1', count: '0', length: '0' },
        { type: '11\'\'4 kg', key: 'p_11Inch4Kg1', count: '0', length: '0' },
    ]
    appearance;
    pipeUrl;

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private app: AppService
    ) {
        this.appearance = this.config.getConfig('formAppearance')
        this.pipeUrl = this.config.getAbsoluteUrl('pipeCount') + '/' + this.auth.userid;
        this.route.data.subscribe((data) => {
            this.godownTypes = data.pipeData.goDowns;
            this.selectedGodown = data.pipeData.godownId;
            const pipes = data.pipeData.pipes;
            this.pipes.forEach(pipeObj => {
                pipeObj.count = pipes[pipeObj.key] ? pipes[pipeObj.key].toString() : '0';
                pipeObj.length = pipes[pipeObj.key] ? (pipes[pipeObj.key] * 20).toString() : '0';
            });
            this.pipeDataSource = new MatTableDataSource(this.pipes)
        })
    }

    public onButtonClick($event) {
        console.log($event);
    }

    public godownChange($event: MatSelectChange) {
        this.loading = true;
        this.godownSelectDisabled = true;
        const pipeUrl = this.pipeUrl + '/' + $event.value;
        this.app.selectedGodownId = $event.value;
        this.http.get(pipeUrl).pipe(finalize(() => {
            this.loading = false;
            this.godownSelectDisabled = false;
        })).subscribe(pipes => {
            this.pipes.forEach(pipeObj => {
                pipeObj.count = pipes[pipeObj.key] ? pipes[pipeObj.key].toString() : '0';
                pipeObj.length = pipes[pipeObj.key] ? (pipes[pipeObj.key] * 20).toString() : '0';
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
            width: '60vw',
            data: {
                selectedGodownId: this.selectedGodown,
                godownTypes: this.godownTypes,
                pipes: this.pipes
            },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((pipes) => {
            if (pipes) {
                this.pipes.forEach(pipeObj => {
                    pipeObj.count = pipes[pipeObj.key] ? pipes[pipeObj.key].toString() : '0';
                    pipeObj.length = pipes[pipeObj.key] ? (pipes[pipeObj.key] * 20).toString() : '0';
                });
                this.pipeDataSource = new MatTableDataSource(this.pipes);
                if (pipes.godown_id) {
                    this.selectedGodown = pipes.godown_id
                    this.app.selectedGodownId = this.selectedGodown;
                }
            }
        })
    }

    navigateToViewBill() {
        this.router.navigate(['postlogin', 'viewBills'])
    }
}