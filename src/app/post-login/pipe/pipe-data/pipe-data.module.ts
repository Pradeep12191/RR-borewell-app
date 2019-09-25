import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { PipeDataComponent } from './pipe-data.component';
import { PipeDataRoutingModule } from './pipe-data-routing.module';
import { PipeDataResolver } from '../../../guards/resolveGuard/pipes/pipe-data.resolver';
import { ExpandTableModule } from '../../../expand-table/expand-table.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        PipesModule,
        ExpandTableModule,
        PipeDataRoutingModule,
        ScrollingModule,
        FormsModule,
        InfiniteScrollModule
    ],
    declarations: [
        PipeDataComponent
    ],
    providers: [
        PipeDataResolver
    ]

})
export class PipeDataModule {

}