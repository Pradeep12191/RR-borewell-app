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
import { RpmHourFeetResolver } from '../../guards/resolveGuard/rpm-hour-feet.resolver';
import { OverlayCardService } from '../../services/overlay-card.service';
import { CompressorAirFilterLimitResolver } from '../../guards/resolveGuard/compressor-air-filter-service-limt.resolver';
import { AddDieselPopupComponent } from './add-diesel-popup/add-diesel-popup.component';
import { ServiceCompleteConfirmDialog } from './service-complete-confirm-dialog/service-complete-confirm-dialog.component';
import { TractorsResolver } from '../../guards/resolveGuard/tractors.resolver';

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
        AssignBitConfirmDialogComponent,
        ServiceCompleteConfirmDialog,
        AddDieselPopupComponent,
        // AddBookPopupComponent
    ],
    entryComponents: [
        AssignVehicleDialogComponent,
        RpmConfirmAssignVehicleDialogComponent,
        ServiceCompleteConfirmDialog,
        AssignBitDialogComponent,
        AssignBitConfirmDialogComponent,
        AddDieselPopupComponent
        // AddBookPopupComponent
    ],
    providers: [
        OverlayCardService,
        BitSizeListResolver,
        BitGodownsResolver,
        RpmHourFeetResolver,
        AddBitService,
        RpmEntryService,
        CompressorAirFilterLimitResolver,
        TractorsResolver
    ]
})
export class RpmEntryModule {

}