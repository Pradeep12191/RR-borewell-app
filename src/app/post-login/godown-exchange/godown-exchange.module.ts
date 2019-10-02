import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { GodownExchangeRoutingModule } from './godown-exchange-routing.module';
import { GodownExchangeComponent } from './godown-exchange.component';
import { TransferItemsModule } from '../../transfer-items/transfer-items.module';
import { ConfirmGodownExchangeComponent } from './confirm-godown-exchange-dialog/confirm-godown-exchange-dialog.component';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        GodownExchangeRoutingModule,
        DirectiveModule,
        TransferItemsModule,
        PipesModule
    ],
    declarations: [
        GodownExchangeComponent,
        ConfirmGodownExchangeComponent
    ],
    entryComponents: [
        ConfirmGodownExchangeComponent
    ],
    providers: [
    ]
})
export class GodownExchangeModule {

}