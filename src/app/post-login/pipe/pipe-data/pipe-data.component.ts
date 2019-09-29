import { Component, OnDestroy, ViewChild } from '@angular/core';
import { PipeData } from '../../../models/PipeData';
import { Column } from '../../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, BehaviorSubject, Observable, throwError } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { AuthService } from '../../../services/auth.service';
import { tap, throttleTime, mergeMap, scan, map, catchError, materialize, reduce, finalize } from 'rxjs/operators';
import { FADE_IN_ANIMATION } from '../../../animations';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from '../../../models/Vehicle';
import { LoaderService } from '../../../services/loader-service';

const ALL_VEHICLE_OPTION: Vehicle = { regNo: 'All Vehicle', type: '', vehicle_id: 'all' }
const UNASSIGNED_PIPES_OPTION: Vehicle = { regNo: 'Pipes in Stock', type: '', vehicle_id: 'unassigned' }

@Component({
    templateUrl: './pipe-data.component.html',
    styleUrls: ['./pipe-data.component.scss'],
    animations: [FADE_IN_ANIMATION]
})
export class PipeDataComponent implements OnDestroy {
    // pipes: PipeData[];
    pipeDataSource: MatTableDataSource<any>;
    routeDataSubscription: Subscription;
    routeParamsSubscription: Subscription;
    pipeType;
    pipeSize;
    godownType;
    theEnd = false;
    batch = 100;
    offset = new BehaviorSubject(null);
    infinite: Observable<any>;
    pipeDataBatchUrl;
    pipeData = [];
    loading = true;
    @ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;
    selectedVehicle: Vehicle;
    vehicles: Vehicle[];
    errorOccured;
    vehicleDisabled;
    selectedGodownId = 'all'
    public columns: Column[] = [
        { id: 'billno', name: 'Bill No', type: 'string', width: '20', isCenter: true },
        { id: 'gudown_type', name: 'Godown Type', type: 'string', width: '20', isCenter: true, style: { textTransform: 'uppercase' } },
        { id: 'serial_no', name: 'Serial No', type: 'string', width: '20', isCenter: true },
        { id: 'vehicle_no', name: 'Vehicle No', type: 'string', width: '40', isCenter: true }
    ]
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private config: ConfigService,
        private auth: AuthService,
        private http: HttpClient,
        private toastr: ToastrService,
        private loader: LoaderService
    ) {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            console.log(data.vehicles);
            this.vehicles = data.vehicles;
            this.vehicles.unshift(UNASSIGNED_PIPES_OPTION);
            this.vehicles.unshift(ALL_VEHICLE_OPTION);
            this.selectedVehicle = this.vehicles[0];
            // this.pipes = data.pipes;
            // this.pipeDataSource = new MatTableDataSource(this.pipes)
        })

        this.routeParamsSubscription = this.route.paramMap.subscribe((paramMap) => {
            this.pipeType = paramMap.get('pipeType');
            this.pipeSize = paramMap.get('pipeSize');
            this.godownType = paramMap.get('godownType');
        });

        this.pipeDataBatchUrl = this.config.getAbsoluteUrl('PipeData');


        const batchMap = this.offset.pipe(

            throttleTime(500),
            tap(() => {
                console.log('throttle')
            }),
            mergeMap(n => this.getPipeData(n).pipe(materialize())),
            tap((next) => {
                if (next.error) {
                    this.errorOccured = true;
                    this.loading = false;
                    this.toastr.error('Error While Fetching Data...', null, { timeOut: 2000 })
                }
            }),
            map((batch) => {
                if (batch.error || !batch.hasValue) {
                    return [...this.pipeData];
                }
                return [...this.pipeData, ...batch.value]
            }),
            tap(d => {
                this.pipeData = d;
                this.loading = false;
                console.log('source', d)
            })
        )

        this.infinite = batchMap.pipe(map(v => Object.values(v)));
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe(); }
        if (this.routeParamsSubscription) { this.routeParamsSubscription.unsubscribe(); }
    }

    retry() {
        this.offset.next(null);
    }

    vehicleChange() {
        this.offset.next(null);
    }

    downloadPdf() {
        const pipeDataurl = this.config.getReportGenerateUrl('pipeData');
        const reportDownloadUrl = this.config.getReportDownloadUrl();
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('godown_id', this.selectedGodownId)
            .append('vehicle_id', this.selectedVehicle.vehicle_id)
            .append('vehicle_no', this.selectedVehicle.regNo)
            .append('pipe_size', this.pipeSize)
            .append('pipe_type', this.pipeType)
            .append('start', '0')
            .append('end', '100')
        this.loader.showSaveLoader('Generating report ...')
        this.http.get<{ filename: string }>(pipeDataurl, { params: params }).pipe(finalize(() => {
            this.loader.hideSaveLoader()
        })).subscribe(({ filename }) => {
            this.toastr.success('Report generated successfully', null, { timeOut: 2000 });
            console.log(filename);
            window.open(reportDownloadUrl + '/' + filename, '_blank');
        }, (err) => {
            this.toastr.error('Error while generating report', null, { timeOut: 2000 });
        })
    }

    backToPipes() {
        this.router.navigate(['postlogin', 'pipes']);
    }

    nextBatch($event, offset) {
        // offset last item in the list
        if (this.theEnd) {
            this.loading = false;
            return;
        }
        const end = this.viewport.getRenderedRange().end;
        const length = this.viewport.getDataLength();

        if (this.pipeData.length < this.batch) {
            return;
        }

        if (end === length) {
            this.loading = true;
            this.offset.next(offset)
        }
    }

    trackByFn(i) {
        return i
    }

    getPipeData(next) {
        let end = '100';
        let start = '0'
        if (next === null) {
            this.pipeData = [];
            this.theEnd = false;
            // this.viewport.scrollToIndex(0);
        } else {
            end = (this.batch + next).toString()
            start = next.toString();
        }


        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('pipe_size', this.pipeSize)
            .append('start', start)
            .append('vehicle_id', this.selectedVehicle.vehicle_id)
            .append('end', this.batch.toString());
        return this.http.get<any[]>(this.pipeDataBatchUrl, { params }).pipe(
            tap(arr => {
                this.loading = false;
                arr.length ? null : this.theEnd = true;
            })
        )
    }
}