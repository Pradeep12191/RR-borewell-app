import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { ViewHammersComponent } from './view-hammers.component';
import { ViewHammersRoutingModule } from './view-hammers-routing.module';
import { HammersService } from '../hammers.service';
import { StoreModule } from '@ngrx/store';
import * as fromViewHammers from './store/reducers';
import { ViewHammersResolver } from './view-hammers.resolver';
import { EffectsModule } from '@ngrx/effects';
import { ViewHammersEffects } from './store/effects';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        ExpandTableModule,
        ViewHammersRoutingModule,
        PipesModule,
        StoreModule.forFeature('viewHammer', fromViewHammers.reducer),
        EffectsModule.forFeature([ViewHammersEffects])
    ],
    declarations: [
        ViewHammersComponent
    ],
    providers: [
        HammersService,
        ViewHammersResolver
    ]
})
export class ViewHammersModule {

}