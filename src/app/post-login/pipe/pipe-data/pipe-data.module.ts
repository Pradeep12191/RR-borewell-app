import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { PipeDataComponent } from './pipe-data.component';
import { PipeDataRoutingModule } from './pipe-data-routing.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        PipesModule,
        PipeDataRoutingModule
    ],
    declarations: [
        PipeDataComponent
    ],

})
export class PipeDataModule {

}