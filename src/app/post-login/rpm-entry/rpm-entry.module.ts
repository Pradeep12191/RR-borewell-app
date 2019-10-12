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
import { BitGodownsResolver } from '../../guards/resolveGuard/bit/bit-godowns.resolver';
import { AddBitService } from '../bits/add-bit-dialog/add-bit.service';
import { BitSizeListResolver } from '../../guards/resolveGuard/bit/bit-size-list.resolver';
import { AssignBitDialogComponent } from './assign-bit-dialog/assign-bit-dialog.component';
import { AssignBitConfirmDialogComponent } from './assign-bit-dialog/assign-bit-confirm-dialog/assign-bit-confirm-dialog.component';

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
        RpmConfirmAssignVehicleDialogComponent,
        AssignBitDialogComponent,
        AssignBitConfirmDialogComponent
        // AddBookPopupComponent
    ],
    entryComponents: [
        AssignVehicleDialogComponent,
        RpmConfirmAssignVehicleDialogComponent,
        AssignBitDialogComponent,
        AssignBitConfirmDialogComponent
        // AddBookPopupComponent
    ],
    providers: [
        BitSizeListResolver,
        BitGodownsResolver,
        AddBitService
    ]
})
export class RpmEntryModule {

}