import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AddBitService } from '../add-bit-dialog/add-bit.service';
import { ViewBitResolver } from '../../../guards/resolveGuard/bit/view-bit.resolver';
import { PipesModule } from '../../../pipes/pipes.module';
import { BitLifeRoutingModule } from './bit-life-routing.module';
import { BitLifeComponent } from './bit-life.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        ExpandTableModule,
        BitLifeRoutingModule,
        PipesModule
    ],
    declarations: [
        BitLifeComponent
    ],
    providers: [
    ]
})
export class BitLifeModule {

}