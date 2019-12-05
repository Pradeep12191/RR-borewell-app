import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { HammerLifeComponent } from './hammer-life.component';
import { HammersService } from '../hammers.service';
import { HammerLifeRoutingModule } from './hammer-life-routing.module';
import { HammerLifeResolver } from 'src/app/guards/resolveGuard/hammer/hammer-life.reolver';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        ExpandTableModule,
        HammerLifeRoutingModule,
        PipesModule
    ],
    declarations: [
        HammerLifeComponent
    ],
    providers: [
        HammersService,
        HammerLifeResolver
    ]
})
export class HammerLifeModule {

}