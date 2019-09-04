import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';


@Component({
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {

    constructor(
        private dialog: MatDialog
    ) {

    }

    openAddVehicle() {
        const dialogRef = this.dialog.open(AddVehicleDialogComponent)
        dialogRef.afterClosed().subscribe((response) => {

        })
    }
}