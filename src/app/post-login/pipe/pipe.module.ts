import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PipeComponent } from './pipe.component';
import { PipeRoutingModule } from './pipe-routing.module';
import { AddPipeDialogComponent } from './add-pipe-dialog/add-pipe-dialog.component';
import { DirectiveModule } from '../../directives/directive.module';
import { PipesResolver } from '../../guards/resolveGuard/select-option/pipes.resolver';
import { AddPipeComponent } from './add-pipe-dialog/add-pipe/add-pipe.component';
import { ConfirmPipeComponent } from './add-pipe-dialog/confirm-pipe/confirm-pipe.component';

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
        AddPipeDialogComponent,
        AddPipeComponent,
        ConfirmPipeComponent
    ],
    entryComponents: [
        AddPipeDialogComponent
    ],
    providers: [
        PipesResolver
    ]
})
export class PipeModule {

}