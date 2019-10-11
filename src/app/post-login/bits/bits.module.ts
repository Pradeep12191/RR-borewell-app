import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { BitsComponent } from './bits.component';
import { BitsRoutingModule } from './bits-routing.module';
import { AddBitDialogComponent } from './add-bit-dialog/add-bit-dialog.component';
import { AddBitComponent } from './add-bit-dialog/add-bit/add-bit.component';
import { ConfirmBitComponent } from './add-bit-dialog/confirm-bit/confirm-bit.component';
import { AddCompanyPopup } from './add-bit-dialog/add-bit/add-company-popup/add-company-popup.compoent';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BitListResolver } from '../../guards/resolveGuard/bit/bit-list.resolver';
import { PipesModule } from '../../pipes/pipes.module';
import { BitCompaniesResolver } from '../../guards/resolveGuard/bit/bit-companies.resolver';
import { AddBitService } from './add-bit-dialog/add-bit.service';
import { OverlayCardService } from '../../services/overlay-card.service';

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
        ScrollingModule,
        BitsRoutingModule,
        PipesModule
    ],
    declarations: [
        BitsComponent,
        AddBitDialogComponent,
        AddBitComponent,
        ConfirmBitComponent,
        AddCompanyPopup
    ],
    entryComponents: [
        AddBitDialogComponent,
        AddCompanyPopup
    ],
    providers: [
        BitListResolver,
        BitCompaniesResolver,
        AddBitService,
        OverlayCardService
    ]
})
export class BitsModule {

}