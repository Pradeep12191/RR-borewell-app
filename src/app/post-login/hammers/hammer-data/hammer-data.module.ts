import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../../pipes/pipes.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { BitSizeListResolver } from '../../../guards/resolveGuard/bit/bit-size-list.resolver';
import { DirectiveModule } from '../../../directives/directive.module';
import { HammerDataRoutingModule } from './hammer-data-routing.module';
import { HammerDataComponent } from './hammer-data.component';
import { HammersService } from '../hammers.service';
import { HammerListResolver } from 'src/app/guards/resolveGuard/hammer/hammer-list.resolver';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        FlexLayoutModule,
        PipesModule,
        HammerDataRoutingModule,
        ScrollingModule,
        FormsModule,
        InfiniteScrollModule,
        DirectiveModule
    ],
    declarations: [
        HammerDataComponent
    ],
    providers: [
        HammersService,
        HammerListResolver,
    ]

})
export class HammerDataModule {

}