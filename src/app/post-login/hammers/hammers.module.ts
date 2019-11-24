import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';

import { PipesModule } from '../../pipes/pipes.module';
import { OverlayCardService } from '../../services/overlay-card.service';
import { HammersComponent } from './hammers.component';
import { HammersRoutingModule } from './hammers-routing,module';
import { StoreModule } from '@ngrx/store';
import { A11yModule } from '@angular/cdk/a11y';
import * as fromHammer from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { HammerEffects } from './store/effects';
import { HammersService } from './hammers.service';
import { HammersResolver } from './hammers.resolver';
import { AddHammerDialogComponent } from './add-hammer-dialog/add-hammer-dialog.component';
import { HammerCompaniesResolver } from './hammer-companies.resolver';
import { AddHammerComponent } from './add-hammer-dialog/add-hammer/add-hammer.component';
import { ConfirmHammerComponent } from './add-hammer-dialog/confirm-hammer/confirm-hammer.component';
import { AddHammerCompanyPopup } from './add-hammer-dialog/add-hammer/add-hammer-company-popup/add-hammer-company-popup.compoent';

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
        A11yModule,
        HammersRoutingModule,
        StoreModule.forFeature('hammerState', fromHammer.reducer),
        EffectsModule.forFeature([HammerEffects])
    ],
    declarations: [
        HammersComponent,
        AddHammerDialogComponent,
        AddHammerComponent,
        AddHammerCompanyPopup,
        ConfirmHammerComponent
    ],
    entryComponents: [
        AddHammerDialogComponent,
        AddHammerCompanyPopup
    ],
    providers: [
        OverlayCardService,
        HammerEffects,
        HammersService,
        HammersResolver,
        HammerCompaniesResolver
    ]
})
export class HammersModule {

}