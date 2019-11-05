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
import { BitSizeListResolver } from '../../../guards/resolveGuard/bit/bit-size-list.resolver';
import { BitService } from '../bit.service';
import { AddBitService } from '../add-bit-dialog/add-bit.service';
import { DirectiveModule } from '../../../directives/directive.module';

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
        InfiniteScrollModule,
        DirectiveModule
    ],
    declarations: [
        BitDataComponent
    ],
    providers: [
        AddBitService,
        BitSizeListResolver,
        BitService
    ]

})
export class BitDataModule {

}