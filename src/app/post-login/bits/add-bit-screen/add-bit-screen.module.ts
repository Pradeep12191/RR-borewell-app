import { NgModule } from '@angular/core';
import { ExpandTableModule } from '../../../expand-table/expand-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../../directives/directive.module';
import { AddBitScreenComponent } from './add-bit-screen.component';
import { AddBitScreenRoutingModule } from './add-bit-screen-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
        AddBitScreenRoutingModule,
        ScrollingModule
    ],
    declarations: [
        AddBitScreenComponent
    ]
})
export class AddBitScreenModule {

}