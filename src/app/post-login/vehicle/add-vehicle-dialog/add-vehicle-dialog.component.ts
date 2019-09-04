import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../../services/config.service';

@Component({
    templateUrl: './add-vehicle-dialog.component.html',
    styleUrls: ['./add-vehicle-dialog.component.scss']
})
export class AddVehicleDialogComponent {
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