import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {
    appearance;
    vehicleTypes = ['Rig'];
    vehicleForm: FormGroup;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.vehicleForm = this.fb.group({
            regNo: ['', Validators.required],
            type: ['', Validators.required]
        })
    }

    saveVehicle() {
        console.log(JSON.stringify(this.vehicleForm.value, null, 2));
    }
}