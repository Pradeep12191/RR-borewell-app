import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { RpmEntryComponent } from './rpm-entry-component';
import { RpmEntryRoutingModule } from './rpm-entry-routing.module';
import { AddBookPopupComponent } from './add-book-popup/add-book-popup.component';
import { AssignVehicleDialogComponent } from './assign-vehicle-dialog/assign-vehicle-dialog.component';
import { TransferItemsModule } from '../../transfer-items/transfer-items.module';
import { RpmEntryService } from './rpm-entry.service';
import { RpmConfirmAssignVehicleDialogComponent } from './assign-vehicle-dialog/rpm-confirm-assign-vehicle-dialog/rpm-confirm-assign-vehicle-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        RpmEntryRoutingModule,
        TransferItemsModule,
        DirectiveModule
    ],
    declarations: [
        RpmEntryComponent,
        AssignVehicleDialogComponent,
        RpmConfirmAssignVehicleDialogComponent
        // AddBookPopupComponent
    ],
    entryComponents: [
        AssignVehicleDialogComponent,
        RpmConfirmAssignVehicleDialogComponent
        // AddBookPopupComponent
    ],
    providers: [
        
    ]
})
export class RpmEntryModule {

}