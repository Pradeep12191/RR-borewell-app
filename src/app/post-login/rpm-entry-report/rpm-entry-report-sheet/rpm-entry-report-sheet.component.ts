import { Component, Input, OnDestroy } from '@angular/core';
import { RpmTableData } from '../../../models/RpmTableData';
import { PipeSize } from '../../../models/PipeSize';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'rpm-entry-report-sheet',
    templateUrl: './rpm-entry-report-sheet.component.html',
    styleUrls: ['./rpm-entry-report-sheet.component.scss']
})
export class RpmEntryReportSheetComponent implements OnDestroy {
    @Input() rpmTableData: RpmTableData;
    pipes: PipeSize[];
    routeDataSubscription: Subscription;
    pipeTotalFlex = 80;
    pipeFlex = 10;
    constructor(
        private route: ActivatedRoute
    ) {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.pipes = data.pipes
            this.pipeFlex = this.pipeTotalFlex / this.pipes.length;
            this.pipeFlex = Math.round(this.pipeFlex * 100) / 100;
            console.log(data.entries.rpmTableData)
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe(); }
    }
}