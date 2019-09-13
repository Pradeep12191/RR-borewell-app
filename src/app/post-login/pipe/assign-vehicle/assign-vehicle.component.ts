import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelectionListChange, MatCheckboxChange, MatSelectionList, MatSelectChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../../models/Vehicle';
import { ConfigService } from '../../../services/config.service';

@Component({
    templateUrl: './assign-vehicle.component.html',
    styleUrls: ['./assign-vehicle.component.scss']
})
export class AssignVehicleComponent implements OnDestroy {
    pipes = [
        { type: '4\'\'4 kg', key: 'p_4Inch4Kg1' },
        { type: '4\'\'6 kg', key: 'p_4Inch6Kg1' },
        { type: '5\'\'6 kg', key: 'p_5Inch6Kg1' },
        { type: '5\'\'8 kg', key: 'p_5Inch8Kg1' },
        { type: '7\'\'6 kg', key: 'p_7Inch6Kg1' },
        { type: '7\'\'8 kg', key: 'p_7Inch8Kg1' },
        { type: '8\'\'4 kg', key: 'p_8Inch4Kg1' },
        { type: '11\'\'4 kg', key: 'p_11Inch4Kg1' },
    ];
    pipeName;
    selectedPipes = [];
    searchTerm = '';
    pipeSerialNos: { value: number, isSelected: boolean }[];
    selectAllChecked = false;
    @ViewChild(MatSelectionList, { static: false }) selectList: MatSelectionList;
    routeParamSubscription: Subscription;
    routeDataSubscription: Subscription;
    vehicles: Vehicle[];
    selectedVehicle: Vehicle;
    appearance;
    othersSelected;
    otherRemarks;

    constructor(
        private route: ActivatedRoute,
        private config: ConfigService
    ) {
        this.route.paramMap.subscribe(paramMap => {
            const pipeType = paramMap.get('pipeType');
            this.pipeName = this.pipes.find(pipe => pipe.key === pipeType).type;
        });

        this.route.data.subscribe(data => {
            console.log(data);
            this.vehicles = data.vehicles;
            this.vehicles.push({ regNo: 'Others', type: '', vehicle_id: 'others' })
        })

        this.pipeSerialNos = Array.from({ length: 50 }).map((_, i) => {
            return { value: i + 1, isSelected: false }
        });

        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe(); }
        if (this.routeParamSubscription) { this.routeParamSubscription.unsubscribe(); }
    }

    onSelect($event: MatSelectionListChange) {
        const value = $event.option.value.value;
        const obj = $event.option.value;
        if ($event.option.selected) {
            this.selectedPipes.push(value)
            this.selectedPipes.sort((a, b) => a - b);
            obj.isSelected = true;
        } else {
            if (this.selectedPipes.indexOf(value) !== -1) {
                const i = this.selectedPipes.indexOf(value);
                this.selectedPipes.splice(i, 1).sort((a, b) => a - b);
                obj.isSelected = false;
            }
        }
        this.selectAllChecked = this.pipeSerialNos.every(pipe => pipe.isSelected);
    }

    removeItem(pipeSerialNo) {
        const leftListIndex = this.pipeSerialNos.map(pipe => pipe.value).indexOf(pipeSerialNo);
        const rightListIndex = this.selectedPipes.indexOf(pipeSerialNo);
        if (rightListIndex !== - 1) {
            this.selectedPipes.splice(rightListIndex, 1);
        }

        if (leftListIndex !== -1) {
            this.pipeSerialNos.find((_, i) => i === leftListIndex).isSelected = false;
        }
        this.selectAllChecked = this.pipeSerialNos.every(pipe => pipe.isSelected);
    }

    selectAllChange($event: MatCheckboxChange) {
        if ($event.checked) {
            this.selectList.selectAll();
            this.pipeSerialNos.forEach(pipe => pipe.isSelected = true);
            return this.selectedPipes = this.pipeSerialNos.map(pipe => pipe.value);
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
}