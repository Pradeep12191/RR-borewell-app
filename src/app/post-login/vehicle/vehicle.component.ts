import { Component, OnDestroy } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';
import { Column } from '../../expand-table/Column';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from './Vehicle';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnDestroy {
    vehicles: Vehicle[];
    vehicleTypes = [];
    vehicleDataSource: MatTableDataSource<Vehicle>;
    routeSubscription: Subscription;
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '15' },
        { id: 'regNo', name: 'Registration Number', type: 'string', width: '45' },
        { id: 'type', name: 'Type', type: 'string', width: '40' }
    ]

    constructor(
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) {

        this.routeSubscription = this.route.data.subscribe(data => {
            console.log(data)
            if (data.vehicleTypes) {
                this.vehicleTypes = data.vehicleTypes;
            }
            if (data.vehicles) {
                this.vehicles = data.vehicles
                this.vehicleDataSource = new MatTableDataSource(this.vehicles);
            }
        })
    }

    ngOnDestroy() {
        if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
    }

    openAddVehicle() {
        const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
            data: { vehicleTypes: this.vehicleTypes }
        })
        dialogRef.afterClosed().subscribe((vehicle: Vehicle) => {
            console.log(vehicle)
            if (vehicle) {
                this.vehicles.push(vehicle);
                this.vehicleDataSource = new MatTableDataSource<Vehicle>(this.vehicles);
            }

        })
    }
}