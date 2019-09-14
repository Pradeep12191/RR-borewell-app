import { Component, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectionListChange, MatCheckboxChange, MatSelectionList, MatSelectChange, MatSelect } from '@angular/material';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../../models/Vehicle';
import { ConfigService } from '../../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './assign-vehicle.component.html',
    styleUrls: ['./assign-vehicle.component.scss']
})
export class AssignVehicleComponent implements OnDestroy, AfterViewInit {
    pipes = [
        { type: '4\'\'4 kg', key: 'p_4Inch4Kg1', postParam: '44' },
        { type: '4\'\'6 kg', key: 'p_4Inch6Kg1', postParam: '46' },
        { type: '5\'\'6 kg', key: 'p_5Inch6Kg1', postParam: '56' },
        { type: '5\'\'8 kg', key: 'p_5Inch8Kg1', postParam: '58' },
        { type: '7\'\'6 kg', key: 'p_7Inch6Kg1', postParam: '76' },
        { type: '7\'\'8 kg', key: 'p_7Inch8Kg1', postParam: '78' },
        { type: '8\'\'4 kg', key: 'p_8Inch4Kg1', postParam: '84' },
        { type: '11\'\'4 kg', key: 'p_11Inch4Kg1', postParam: '114' },
    ];
    pipeName;
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
    updateUrl;
    godownId;
    godownType;
    pipeKey;

    constructor(
        private route: ActivatedRoute,
        private config: ConfigService,
        private router: Router,
        private http: HttpClient,
        private auth: AuthService,
        private toastr: ToastrService
    ) {
        this.route.paramMap.subscribe(paramMap => {
            this.pipeKey = paramMap.get('pipeKey');
            this.godownType = paramMap.get('godownType');
            this.godownId = paramMap.get('godown_id');
            this.pipeName = this.pipes.find(pipe => pipe.key === this.pipeKey).type;
        });

        this.route.data.subscribe(data => {
            console.log(data);
            this.vehicles = data.vehicles;
            this.pipeSerialNos = data.pipeSerialNos;
            this.pipeSerialNos.forEach(pipe => pipe['isSelected'] = false);
            // this.vehicles = [...data.vehicles, { regNo: 'Others', type: '', vehicle_id: 'others' }];
        })


        this.appearance = this.config.getConfig('formAppearance');
        this.updateUrl = this.config.getAbsoluteUrl('AssignPipeToVehicle');
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

    savePipe() {
        const pipePostParam = this.pipes.find(pipe => pipe.key === this.pipeKey).postParam;
        let params = new HttpParams().set('user_id', this.auth.userid);
        params = params.append('gudownid', this.godownId);
        params = params.append('pipe_size', pipePostParam);
        const payload = this.selectedPipes.map(pipe => {
            const data = {}
            data['user_id'] = this.auth.userid;
            data['gudown_type'] = this.godownType;
            data['gudown_id'] = this.godownId;
            data['vehicle_no'] = this.selectedVehicle.regNo;
            data['vehicle_id'] = this.selectedVehicle.vehicle_id;
            data['serial_no'] = pipe.serial_no;
            data['serial_no_id'] = pipe.serial_no;
            data['pipe_size'] = pipePostParam;
            data['billno'] = pipe.billno;
            data['remarks'] = '';
            return data;
        });
        console.log(JSON.stringify(payload, null, 2));
        this.http.put(this.updateUrl, payload).subscribe(() => {
            this.toastr.success(`Pipes assigned to vehicle - ${this.selectedVehicle.regNo} successfully`, null, { timeOut: 2000 })
        }, (err) => {
            if (err) {
                this.toastr.error(`Error while assigning pipes to vehicle - ${this.selectedVehicle.regNo}`, null, { timeOut: 2000 })
            }
        })
    }
}