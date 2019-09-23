import { Component, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectionListChange, MatCheckboxChange, MatSelectionList, MatSelectChange, MatSelect, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../../models/Vehicle';
import { ConfigService } from '../../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AssignVehicleConfirmDialogComponent } from './assign-vehicle-confirm-dialog/assign-vehicle-confirm-dialog.component';
import { Godown } from '../Godown';
import { Pipe } from '../../../models/Pipe';
import { PipeSize } from '../../../models/PipeSize';
import { finalize } from 'rxjs/operators';
import { FADE_OPACTIY_ANIMATION } from '../../../animations/fade-opactiy.animation';

enum Select {
    vehicle = 'vehiclesSelect',
    godown = 'godownSelect',
    pipe = 'pipeSelect'
}

@Component({
    templateUrl: './assign-vehicle.component.html',
    styleUrls: ['./assign-vehicle.component.scss'],
    animations: [FADE_OPACTIY_ANIMATION]
})
export class AssignVehicleComponent implements OnDestroy, AfterViewInit {
    pipeType;
    selectedPipes: { serial_no: string, billno: string, isSelected: boolean }[] = [];
    searchTerm = '';
    pipeSerialNos: { serial_no: string, billno: string, isSelected: boolean }[];
    selectAllChecked = false;
    @ViewChild(MatSelectionList, { static: false }) selectList: MatSelectionList;
    @ViewChild('vehiclesSelect', { static: false }) vehiclesSelect: MatSelect;
    @ViewChild('godownSelect', { static: false }) godownSelect: MatSelect;
    @ViewChild('pipeSelect', { static: false }) pipeSelect: MatSelect;
    routeParamSubscription: Subscription;
    routeDataSubscription: Subscription;
    vehicles: Vehicle[];
    selectedVehicle: Vehicle;
    selectedGodown: Godown;
    selectedPipe: PipeSize;
    vehicleSelectDisabled;
    pipeSelectDisabled;
    godownSelectDisabled;
    appearance;
    othersSelected;
    otherRemarks;
    godownId;
    godownType;
    pipeSize;
    pipeSizes: PipeSize[];
    godowns;
    getUrl;
    serialLoading;
    confirmBtnDisabled


    constructor(
        private route: ActivatedRoute,
        private config: ConfigService,
        private router: Router,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private auth: AuthService,
        private http: HttpClient
    ) {

        this.routeDataSubscription = this.route.data.subscribe(data => {
            console.log(data);
            this.vehicles = data.vehicles;
            this.godowns = data.godowns;
            this.pipeSizes = data.pipeSizes;
            this.getUrl = this.config.getAbsoluteUrl('pipeSerialNos');
            // this.vehicles = [...data.vehicles, { regNo: 'Others', type: '', vehicle_id: 'others' }];
        })


        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe(); }
        if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.godownSelect.open();
            this.godownSelect.focus();
        }, 300)

    }

    jumpTo(ctrlName) {
        setTimeout(() => {
            this[ctrlName].open();
            this[ctrlName].focus();
        })
    }

    onChange(type: 'godown' | 'pipe') {
        if (this.selectedGodown && this.selectedPipe) {
            const pipeSize = this.selectedPipe.size;
            const godownId = this.selectedGodown.godown_id;
            // loading true
            this.serialLoading = true;
            this.disableAllControls(true);

            let params = new HttpParams().set('user_id', this.auth.userid);
            params = params.append('pipe_size', pipeSize);
            params = params.append('gudown_id', godownId);
            this.http.get<any[]>(this.getUrl, { params }).pipe(finalize(() => {
                this.serialLoading = false;
                this.disableAllControls(false);
            }))
                .subscribe((serialNos) => {
                    this.pipeSerialNos = serialNos;
                    this.pipeSerialNos.forEach(s => s['isSelected'] = false);
                    this.selectAllChecked = false;
                    this.searchTerm = ''
                    this.selectedPipes = [];
                    if (type === 'godown') {
                        if(!this.selectedVehicle){
                            return this.jumpTo(Select.vehicle);
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.toastr.error('Error while fetching serial no', null, { timeOut: 2000 })
                    }
                })
        } else {
            if (type === 'godown' && !this.selectedVehicle) {
                return this.jumpTo(Select.vehicle);
            }
        }


    }

    disableAllControls(flag) {
        this.vehicleSelectDisabled = flag;
        this.pipeSelectDisabled = flag;
        this.godownSelectDisabled = flag;
        this.confirmBtnDisabled = flag;
    }

    onSelect($event: MatSelectionListChange) {
        const value = $event.option.value;
        const obj = $event.option.value;
        if ($event.option.selected) {
            this.selectedPipes.push(value)
            this.selectedPipes.sort((a, b) => +a.serial_no - +b.serial_no);
            obj.isSelected = true;
        } else {
            if (this.selectedPipes.indexOf(value) !== -1) {
                const i = this.selectedPipes.indexOf(value);
                this.selectedPipes.splice(i, 1).sort((a, b) => +a.serial_no - +b.serial_no);
                obj.isSelected = false;
            }
        }
        this.selectAllChecked = this.pipeSerialNos.every(pipe => pipe.isSelected);
    }

    removeItem(pipeSerialNo) {
        const rightListIndex = this.selectedPipes.indexOf(pipeSerialNo);
        if (rightListIndex !== - 1) {
            this.selectedPipes.splice(rightListIndex, 1);
        }

        this.pipeSerialNos.find((pipe, i) => pipe === pipeSerialNo).isSelected = false;

        this.selectAllChecked = this.pipeSerialNos.every(pipe => pipe.isSelected);
    }

    selectAllChange($event: MatCheckboxChange) {
        if(this.pipeSerialNos && this.pipeSerialNos.length){
            if ($event.checked) {
                this.selectList.selectAll();
                this.pipeSerialNos.forEach(pipe => pipe.isSelected = true);
                return this.selectedPipes = [...this.pipeSerialNos];
            }
            this.selectList.deselectAll();
            this.selectedPipes = [];
            this.pipeSerialNos.forEach(pipe => pipe.isSelected = false);
        }
    }

    onVehicleChange(event: MatSelectChange) {
        const value: Vehicle = event.value;
        if (value && value.vehicle_id === 'others') {
            return this.othersSelected = true;
        }
        this.othersSelected = false;
        if (!this.selectedPipe) {
            this.jumpTo(Select.pipe);
        }

    }

    onGodownChange() {

    }

    backToPipes() {
        this.router.navigate(['postlogin', 'pipes']);
    }

    openConfirm() {
        if (!this.selectedVehicle || !this.selectedPipes.length) {
            if (!this.selectedVehicle) {
                return this.toastr.error('Please Select a Vehicle', null, { timeOut: 2000 })
            }
            if (!this.selectedPipes.length) {
                return this.toastr.error('Please assign atleast one pipe to vehicle', null, { timeOut: 2000 })
            }
        }

        const dialogRef = this.dialog.open(AssignVehicleConfirmDialogComponent, {
            disableClose: true,
            width: '40vw',
            position: { top: '25px' },
            maxHeight: '95vh',
            data: {
                pipes: this.selectedPipes,
                vehicle: this.selectedVehicle,
                godownType: this.selectedGodown.godownType,
                pipeType: this.selectedPipe.type,
                pipeSize: this.selectedPipe.size,
                godownId: this.selectedGodown.godown_id
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.pipeSerialNos = result;
                this.pipeSerialNos.forEach(pipe => pipe['isSelected'] = false);
                this.selectAllChecked = false;
                this.searchTerm = ''
                this.selectedPipes = [];
            }

        })


    }

    displayHeader() {
        let godown;
        let pipe;
        if (this.selectedGodown) {
            godown = this.selectedGodown.godownType;
        }
        if (this.selectedPipe) {
            pipe = this.selectedPipe.type;
        }
        if (pipe && godown) {
            return godown.toUpperCase() + ' - ' + pipe;
        }
        if (pipe) {
            return pipe;
        }
        if (godown) {
            return godown.toUpperCase();
        }
        return ''
    }
}