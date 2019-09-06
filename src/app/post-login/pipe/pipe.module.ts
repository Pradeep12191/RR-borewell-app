import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PipeComponent } from './pipe.component';
import { PipeRoutingModule } from './pipe-routing.module';
import { AddPipeDialogComponent } from './add-pipe-dialog/add-pipe-dialog.component';
import { DirectiveModule } from '../../directives/directive.module';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        PipeRoutingModule,
        ExpandTableModule,
        DirectiveModule
    ],
    declarations: [
        PipeComponent,
        AddPipeDialogComponent
    ],
    entryComponents: [
        AddPipeDialogComponent
    ],
    providers: [GodownTypesResolver]
})
export class PipeModule {

}