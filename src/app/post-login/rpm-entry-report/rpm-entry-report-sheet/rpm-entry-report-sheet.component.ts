import { Component, Input, OnDestroy, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RpmTableData } from '../../../models/RpmTableData';
import { PipeSize } from '../../../models/PipeSize';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RpmEntry } from '../../../models/RpmEntry';
import { RpmEntrySheet } from '../../../models/RpmEntrySheet';

@Component({
    selector: 'rpm-entry-report-sheet',
    templateUrl: './rpm-entry-report-sheet.component.html',
    styleUrls: ['./rpm-entry-report-sheet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RpmEntryReportSheetComponent implements OnInit {
    @Input() rpmEntry: RpmEntrySheet;
    @Input() pipes: PipeSize[];
    pipeTotalFlex = 80;
    pipeFlex = 10;
    constructor(
    ) {

    }

    ngOnInit() {
        this.pipeFlex = this.pipeTotalFlex / this.pipes.length;
        this.pipeFlex = Math.round(this.pipeFlex * 100) / 100;
    }
}