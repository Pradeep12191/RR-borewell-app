import { Component } from '@angular/core';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource, MatDialog, MatSelectChange } from '@angular/material';
import { AddPipeDialogComponent } from './add-pipe-dialog/add-pipe-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { zip } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { FADE_IN_ANIMATION, listStateTrigger } from '../../animations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../services/app.service';
import { Pipe } from '../../models/Pipe';
import { LastSerialNo } from './LastSerialNo';
import { LoaderService } from '../../services/loader-service';
import { Godown } from './Godown';

const PIPE_LENGTH = 20;
const AllGodownOption: Godown = { godown_id: 'all', godownType: 'All' }
@Component({
    templateUrl: './pipe.component.html',
    styleUrls: ['./pipe.component.scss'],
    animations: [FADE_IN_ANIMATION, listStateTrigger]
})
export class PipeComponent {
    items = [];
    public godownTypes: { godownType: string, godown_id: string }[] = [];
    public selectedGodownId = 'all';
    public godownSelectDisabled;
    loading;
    pipes: Pipe[];
    appearance;
    pipeUrl;
    pipeCountUrl;
    companiesUrl;

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private app: AppService,
        private loader: LoaderService
    ) {
        this.appearance = this.config.getConfig('formAppearance')
        this.pipeUrl = this.config.getAbsoluteUrl('pipeCount');
        this.pipeCountUrl = this.config.getAbsoluteUrl('totalPipeCount');
        this.companiesUrl = this.config.getAbsoluteUrl('companies');
        this.route.data.subscribe((data) => {
            this.godownTypes = data.pipeData.goDowns;
            this.godownTypes.unshift(AllGodownOption);
            this.selectedGodownId = data.pipeData.godownId;
            setTimeout(() => {
                // this.items = [1, 2, 3, 4, 5, 6, 7, 8]
                this.updatePipes(data.pipeData.pipes);
            })

        })
    }

    public onButtonClick($event) {
        const selectedGodwn = this.godownTypes.find(godown => godown.godown_id === this.selectedGodownId)
        if ($event.action === 'ASSIGN_VEHICLE') {
            this.router.navigate(['postlogin/assignVehicle', $event.rowData.pipe_size, $event.rowData.pipe_type, selectedGodwn]);
        }
        if ($event.action === 'VIEW_PIPE_DATA') {
            this.router.navigate(['postlogin/viewPipeData'])
        }
    }

    public assignVehicle(pipe: Pipe, event: MouseEvent) {
        const selectedGodwn = this.godownTypes.find(godown => godown.godown_id === this.selectedGodownId)
        this.router.navigate(['postlogin/assignVehicle', pipe.pipe_size, pipe.pipe_type, selectedGodwn]);
        event.stopPropagation();
    }

    public viewPipeData(pipe: Pipe) {
        this.router.navigate(['postlogin/viewPipeData', pipe.pipe_size, pipe.pipe_type])
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
        const params = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', this.selectedGodownId);

        const pipeCount$ = this.http.get<LastSerialNo[]>(this.pipeCountUrl, { params });
        const companies$ = this.http.get<any[]>(this.companiesUrl, { params });
        this.loader.showSaveLoader('Loading ...');
        zip(pipeCount$, companies$)
            .subscribe(([lastSerialNo, companies]) => {
                const dialogRef = this.dialog.open(AddPipeDialogComponent, {
                    width: '60vw',
                    position: { top: '0px' },
                    maxHeight: '100vh',
                    height: '100vh',
                    data: {
                        selectedGodownId: this.selectedGodownId,
                        godownTypes: this.godownTypes,
                        lastSerialNo,
                        companies
                    },
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe((pipes) => {
                    if (pipes) {
                        this.updatePipes(pipes);
                        this.selectedGodownId = this.app.selectedGodownId
                    }
                });
                this.loader.hideSaveLoader();
            }, (err) => {
                this.loader.hideSaveLoader();
                if (err) {
                    this.toastr.error('Unable to fetch Last Bill Data', null, { timeOut: 2000 })
                }
            })


    }

    navigateToViewBill() {
        this.router.navigate(['postlogin', 'viewBills'])
    }

    updatePipes(pipes) {
        this.pipes = pipes.reverse();

        this.pipes.forEach(pipe => {
            pipe['length'] = pipe.count ? (+pipe.count * PIPE_LENGTH).toString() : '0';
        });
    }

    displayGodown(godownId) {
        return this.godownTypes.find(godown => godown.godown_id === godownId).godownType
    }
}