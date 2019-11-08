import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { TransferItemsModule } from '../../transfer-items/transfer-items.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BitVehicleExchangeRoutingModule } from './bit-vehicle-exchange-routing.module';
import { BitVehicleExchangeComponent } from './bit-vehicle-exchange.component';
import { RpmEntryService } from '../rpm-entry/rpm-entry.service';
import { ConfirmBitVehicleExchangeComponent } from './confirm-bit-vehicle-exchange-dialog/confirm-bit-vehicle-exchange-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        BitVehicleExchangeRoutingModule,
        DirectiveModule,
        TransferItemsModule,
        PipesModule
    ],
    declarations: [
        BitVehicleExchangeComponent,
        ConfirmBitVehicleExchangeComponent
    ],
    entryComponents: [
        ConfirmBitVehicleExchangeComponent
    ],
    providers: [
        RpmEntryService
    ]
})
export class BitVehicleExchangeModule {

}