import { Component } from '@angular/core';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource, MatDialog, MatSelectChange } from '@angular/material';
import { AddPipeDialogComponent } from './add-pipe-dialog/add-pipe-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { FADE_IN_ANIMATION } from '../../animations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../services/app.service';
import { Pipe } from '../../models/Pipe';

const PIPE_LENGTH = 20;

@Component({
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss'],
    animations: [FADE_IN_ANIMATION]
})
export class PipeComponent {

    pipeDataSource: MatTableDataSource<any>;
    public columns: Column[] = [
        { id: 'S.No.', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'pipe_type', name: 'Type', type: 'string', width: '15', isCenter: true },
        { id: 'count', name: 'No. of Pipe Length', type: 'string', width: '30', isCenter: true },
        { id: 'length', name: 'Feet', type: 'string', width: '25', isCenter: true },
        { id: 'assignVehicle', name: 'Assign Vehicle', type: 'iconButton', width: '15', isCenter: true, action: 'ASSIGN_VEHICLE', iconName: 'directions_car' },
        { id: 'viewPipeData', name: 'View Pipe Data', type: 'iconButton', isCenter: true, width: '15', action: 'VIEW_PIPE_DATA', iconName: 'arrow_forward' },
    ]
    public godownTypes: { godownType: string, godown_id: string }[] = [];
    public selectedGodown;
    public godownSelectDisabled;
    loading;
    pipes: Pipe[];
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
        this.pipeUrl = this.config.getAbsoluteUrl('pipeCount');
        this.route.data.subscribe((data) => {
            this.godownTypes = data.pipeData.goDowns;
            this.selectedGodown = data.pipeData.godownId;
            this.updatePipes(data.pipeData.pipes);
        })
    }

    public onButtonClick($event) {
        const selectedGodwn = this.godownTypes.find(godown => godown.godown_id === this.selectedGodown)
        if ($event.action === 'ASSIGN_VEHICLE') {
            this.router.navigate(['postlogin/assignVehicle', $event.rowData.key, selectedGodwn]);
        }

    }

    public godownChange($event: MatSelectChange) {
        this.loading = true;
        this.godownSelectDisabled = true;
        this.app.selectedGodownId = $event.value;
        const params = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', $event.value)
        this.http.get(this.pipeUrl, { params }).pipe(finalize(() => {
            this.loading = false;
            this.godownSelectDisabled = false;
        })).subscribe(pipes => {
            this.updatePipes(pipes);
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
                this.updatePipes(pipes);
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

    updatePipes(pipes) {
        this.pipes = pipes;

        this.pipes.forEach(pipe => {
            pipe['length'] = pipe.count ? (+pipe.count * PIPE_LENGTH).toString() : '0';
        });
        this.pipeDataSource = new MatTableDataSource(this.pipes)
    }
}