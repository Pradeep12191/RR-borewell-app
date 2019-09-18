import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExpandTableModule } from '../../expand-table/expand-table.module';
import { FormsModule } from '@angular/forms';
import { ViewBillComponent } from './view-bill.component';
import { ViewBillRoutingModule } from './view-bill-routing.module';
import { BillsResolver } from '../../guards/resolveGuard/bills.resolver';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectiveModule } from '../../directives/directive.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        SharedModule,
        FlexLayoutModule,
        ExpandTableModule,
        ViewBillRoutingModule,
        PipesModule,
        DirectiveModule
    ],
    declarations: [
        ViewBillComponent,
    ],
    providers: [
        BillsResolver
    ]
})
export class ViewBillModule{

}