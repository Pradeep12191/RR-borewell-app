import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../../services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './add-vehicle-dialog.component.html',
    styleUrls: ['./add-vehicle-dialog.component.scss']
})
export class AddVehicleDialogComponent {
    appearance;
    vehicleTypes = ['Rig'];
    vehicleForm: FormGroup;
    vehiclePostUrl: string;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data,
        private http: HttpClient,
        private auth: AuthService,
        private toastr: ToastrService,
        private dialog: MatDialogRef<AddVehicleDialogComponent>
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.vehicleForm = this.fb.group({
            regNo: ['', Validators.required],
            type: ['', Validators.required]
        })
        this.vehicleTypes = data.vehicleTypes;
        this.vehiclePostUrl = this.config.getAbsoluteUrl('addvehicle');
    }

    saveVehicle() {
        console.log(JSON.stringify(this.vehicleForm.value, null, 2));
        this.http.post(this.vehiclePostUrl, this.vehicleForm.value).subscribe((response) => {
            this.toastr.success('Vehicle added successfully', null, { timeOut: 1500 });
            this.dialog.close(response);
        }, (err) => {
            if (err) {
                this.toastr.error('Error while adding Vehicle', null, { timeOut: 1500 });
            }
        })
    }
}