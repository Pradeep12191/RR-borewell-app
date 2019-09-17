import { Component, OnDestroy } from '@angular/core';
import { PipeData } from '../../../models/PipeData';
import { Column } from '../../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './pipe-data.component.html',
    styleUrls: ['./pipe-data.component.scss']
})
export class PipeDataComponent implements OnDestroy {
    pipes: PipeData[];
    pipeDataSource: MatTableDataSource<any>;
    routeDataSubscription: Subscription;
    routeParamsSubscription: Subscription;
    pipeType;
    godownType;
    public columns: Column[] = [
        { id: 'billno', name: 'Bill No', type: 'string', width: '25', isCenter: true },
        { id: 'serial_no', name: 'Serial No', type: 'string', width: '30', isCenter: true },
        { id: 'vehicle_no', name: 'Vehicle No', type: 'string', width: '45', isCenter: true }
    ]
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.pipes = data.pipes;
            this.pipeDataSource = new MatTableDataSource(this.pipes)
        })

        this.routeParamsSubscription = this.route.paramMap.subscribe((paramMap) => {
            this.pipeType = paramMap.get('pipeType');
            this.godownType = paramMap.get('godownType');
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe(); }
        if (this.routeParamsSubscription) { this.routeParamsSubscription.unsubscribe(); }
    }

    backToPipes() {
        this.router.navigate(['postlogin', 'pipes']);
    }
}