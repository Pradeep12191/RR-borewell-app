import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';
import { Column } from '../../expand-table/Column';


@Component({
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent {
    vehicles = [
        {regNo: 'TN13D 6288', type: 'Lorry'},
        {regNo: 'TN13D 6288', type: 'Lorry'}
    ]
    vehicleDataSource: MatTableDataSource<any>;
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '15' },
        { id: 'regNo', name: 'Registration Number', type: 'string', width: '35' },
        { id: 'type', name: 'Type', type: 'string', width: '30' },
        { id: 'edit', name: '', type: 'button', width: '10' },
        { id: 'delete', name: '', type: 'button', width: '10' },
    ]

    constructor(
        private dialog: MatDialog
    ) {
        this.vehicleDataSource = new MatTableDataSource(this.vehicles); 
    }

    openAddVehicle() {
        const dialogRef = this.dialog.open(AddVehicleDialogComponent)
        dialogRef.afterClosed().subscribe((response) => {

        })
    }
}