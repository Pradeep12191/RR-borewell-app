import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { ViewBitComponent } from './view-bit.component';
import { ViewBitRoutingModule } from './view-bit-routing.module';
import { AddBitService } from '../add-bit-dialog/add-bit.service';
import { ViewBitResolver } from '../../../guards/resolveGuard/bit/view-bit.resolver';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        ExpandTableModule,
        ViewBitRoutingModule,
        PipesModule
    ],
    declarations: [
        ViewBitComponent
    ],
    providers: [
        AddBitService,
        ViewBitResolver
    ]
})
export class ViewBitModule {

}