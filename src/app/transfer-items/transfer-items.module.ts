import { NgModule } from '@angular/core';
import { MatCardModule, MatCheckboxModule, MatListModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule, MatFormFieldModule, MatButton, MatButtonModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../directives/directive.module';
import { PipesModule } from '../pipes/pipes.module';
import { TransferItemComponent } from './transfer-items.component';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TransferItemLeftHeaderContentComponent } from './transfer-item-left-header-content/transfer-item-left-header-content.component';
import { TransferItemRightHeaderContentComponent } from './transfer-item-right-header-content/transfer-item-right-header-content.component';
import { TransferItemIntialMsgDirective } from './transfer-item-intial-msg/transfer-item-intial-msg.component';
import { TransferItemLeftListHeaderContentComponent } from './transfer-item-left-list-header/transfer-item-left-list-header.component';
import { TransferItemLeftListContentDirective } from './transfer-item-left-list-content/transfer-item-left-list-content.directive';

@NgModule({
    imports: [
        CommonModule,
        DirectiveModule,
        MatIconModule,
        PipesModule,
        FormsModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        FlexLayoutModule,
        MatCardModule,
        MatCheckboxModule,
        MatListModule,
        MatButtonModule
    ],
    declarations: [
        TransferItemComponent,
        TransferItemLeftHeaderContentComponent,
        TransferItemRightHeaderContentComponent,
        TransferItemIntialMsgDirective,
        TransferItemLeftListHeaderContentComponent,
        TransferItemLeftListContentDirective
    ],
    exports: [
        TransferItemComponent,
        TransferItemLeftHeaderContentComponent,
        TransferItemRightHeaderContentComponent,
        TransferItemIntialMsgDirective,
        TransferItemLeftListHeaderContentComponent,
        TransferItemLeftListContentDirective
    ]

})
export class TransferItemsModule {

}