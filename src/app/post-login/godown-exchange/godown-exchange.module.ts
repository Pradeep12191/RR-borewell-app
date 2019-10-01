import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { GodownExchangeRoutingModule } from './godown-exchange-routing.module';
import { GodownExchangeComponent } from './godown-exchange.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        GodownExchangeRoutingModule,
        DirectiveModule
    ],
    declarations: [
        GodownExchangeComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class GodownExchangeModule {

}