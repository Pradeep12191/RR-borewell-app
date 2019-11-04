import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { BitDataComponent } from './bit-data.component';
import { BitDataRoutingModule } from './bit-data-routing.module';
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
        BitDataRoutingModule,
        ScrollingModule,
        FormsModule,
        InfiniteScrollModule
    ],
    declarations: [
        BitDataComponent
    ],
    providers: [
        
    ]

})
export class BitDataModule {

}