import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { RpmEntryComponent } from './rpm-entry-component';
import { RpmEntryRoutingModule } from './rpm-entry-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        RpmEntryRoutingModule,
        DirectiveModule
    ],
    declarations: [
        RpmEntryComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class RpmEntryModule {

}