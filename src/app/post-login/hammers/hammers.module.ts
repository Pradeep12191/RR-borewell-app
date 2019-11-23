import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { PipesModule } from '../../pipes/pipes.module';
import { OverlayCardService } from '../../services/overlay-card.service';
import { HammersComponent } from './hammers.component';
import { HammersRoutingModule } from './hammers-routing,module';
import { StoreModule } from '@ngrx/store';
import { hammerReducer } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { HammerEffects } from './store/effects';
import { HammersService } from './hammers.service';
import { HammersResolver } from './hammers.resolver';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        ExpandTableModule,
        DirectiveModule,
        PipesModule,
        HammersRoutingModule,
        StoreModule.forFeature('hammerState', hammerReducer),
        EffectsModule.forFeature([HammerEffects])
    ],
    declarations: [
        HammersComponent
    ],
    entryComponents: [
    ],
    providers: [
        OverlayCardService,
        HammerEffects,
        HammersService,
        HammersResolver
    ]
})
export class HammersModule {

}