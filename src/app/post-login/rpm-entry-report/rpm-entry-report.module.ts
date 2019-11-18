import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectiveModule } from '../../directives/directive.module';
import { TransferItemsModule } from '../../transfer-items/transfer-items.module';
import { RpmEntryReportComponent } from './rpm-entry-report.component';
import { RpmEntryReportRoutingModule } from './rpm-entry-report-routing.module';
import { RpmEntryReportResolver } from '../../guards/resolveGuard/rpmEntry/rpm-entry-report.resolve';
import { RpmEntryReportService } from './rpm-entry-report.service';
import { ExpandTableModule } from '../../expand-table/expand-table.module';
import { PipesModule } from '../../pipes/pipes.module';
import { RpmEntryReportSheetComponent } from './rpm-entry-report-sheet/rpm-entry-report-sheet.component';
import { RpmEntryCountReportComponent } from './rpm-entry-count-report/rpm-entry-count-report.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ExpandTableModule,
        MaterialModule,
        SharedModule,
        PipesModule,
        FlexLayoutModule,
        RpmEntryReportRoutingModule,
        TransferItemsModule,
        DirectiveModule
    ],
    declarations: [
        RpmEntryReportComponent,
        RpmEntryReportSheetComponent,
        RpmEntryCountReportComponent
    ],
    providers: [
        RpmEntryReportResolver,
        RpmEntryReportService
    ]
})
export class RpmEntryReportModule {

}