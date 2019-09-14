import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../../directives/directive.module';
import { AssignVehicleComponent } from './assign-vehicle.component';
import { AssignVehicleRoutingModule } from './assign-vehicle-routing.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { PipeSerialNosResolver } from '../../../guards/resolveGuard/pipes/pipe-serial-nos.resolver';
import { AssignVehicleConfirmDialogComponent } from './assign-vehicle-confirm-dialog/assign-vehicle-confirm-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        AssignVehicleRoutingModule,
        DirectiveModule,
        PipesModule
    ],
    declarations: [
        AssignVehicleComponent,
        AssignVehicleConfirmDialogComponent
    ],
    providers: [
        PipeSerialNosResolver
    ],
    entryComponents: [AssignVehicleConfirmDialogComponent]

})
export class AssignVehicleModule {

}