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

@Component({
    templateUrl: './assign-vehicle.component.html',
    styleUrls: ['./assign-vehicle.component.scss']
})
export class AssignVehicleComponent implements OnDestroy, AfterViewInit {
    pipeType;
    selectedPipes: { serial_no: string, billno: string, isSelected: boolean }[] = [];
    searchTerm = '';
    pipeSerialNos: { serial_no: string, billno: string, isSelected: boolean }[];
    selectAllChecked = false;
    @ViewChild(MatSelectionList, { static: false }) selectList: MatSelectionList;
    @ViewChild('vehiclesSelect', { static: false }) vehiclesSelect: MatSelect;
    routeParamSubscription: Subscription;
    routeDataSubscription: Subscription;
    vehicles: Vehicle[];
    selectedVehicle: Vehicle;
    appearance;
    othersSelected;
    otherRemarks;
    godownId;
    godownType;
    pipeSize;

    constructor(
        private route: ActivatedRoute,
        private config: ConfigService,
        private router: Router,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {
        this.routeParamSubscription = this.route.paramMap.subscribe(paramMap => {
            this.pipeSize = paramMap.get('pipeSize');
            this.godownType = paramMap.get('godownType');
            this.godownId = paramMap.get('godown_id');
            this.pipeType = paramMap.get('pipeType')
        });

        this.routeDataSubscription = this.route.data.subscribe(data => {
            console.log(data);
            this.vehicles = data.vehicles;
            this.pipeSerialNos = data.pipeSerialNos;
            this.pipeSerialNos.forEach(pipe => pipe['isSelected'] = false);
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
            this.vehiclesSelect.open();
            this.vehiclesSelect.focus();
        }, 300)

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
        if ($event.checked) {
            this.selectList.selectAll();
            this.pipeSerialNos.forEach(pipe => pipe.isSelected = true);
            return this.selectedPipes = [...this.pipeSerialNos];
        }
        this.selectList.deselectAll();
        this.selectedPipes = [];
        this.pipeSerialNos.forEach(pipe => pipe.isSelected = false);
    }

    onVehicleChange(event: MatSelectChange) {
        const value: Vehicle = event.value;
        if (value && value.vehicle_id === 'others') {
            return this.othersSelected = true;
        }
        this.othersSelected = false;
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

        this.dialog.open(AssignVehicleConfirmDialogComponent, {
            disableClose: true,
            width: '40vw',
            position: { top: '25px' },
            maxHeight: '95vh',
            data: {
                pipes: this.selectedPipes,
                vehicle: this.selectedVehicle,
                godownType: this.godownType,
                pipeType: this.pipeType,
                pipeSize: this.pipeSize,
                godownId: this.godownId
            }
        });


    }
}