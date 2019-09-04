import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VehicleComponent } from './vehicle.component';
import { VehicleRoutingModule } from './vehicle.routing.module';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        VehicleRoutingModule
    ],
    declarations: [
        AddVehicleDialogComponent,
        VehicleComponent
    ],
    entryComponents: [AddVehicleDialogComponent]
})
export class VehicleModule {

}