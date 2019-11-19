import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RpmEntrySheet } from '../../../models/RpmEntrySheet';
import { PipeSize } from '../../../models/PipeSize';

@Component({
    selector: 'rpm-entry-report-count',
    templateUrl: './rpm-entry-count-report.component.html',
    styleUrls: ['./rpm-entry-count-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RpmEntryCountReportComponent {
    @Input() rpmEntry: RpmEntrySheet;
    @Input() pipes: PipeSize[]

    displayHours() {

    }
}