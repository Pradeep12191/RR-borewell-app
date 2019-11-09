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
import { tap, throttleTime, mergeMap, scan, map, catchError, materialize, reduce, finalize, exhaustMap } from 'rxjs/operators';
import { FADE_IN_ANIMATION } from '../../../animations';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from '../../../models/Vehicle';
import { LoaderService } from '../../../services/loader-service';
import { PipeSize } from '../../../models/PipeSize';
import { Godown } from '../Godown';

const ALL_VEHICLE_OPTION: Vehicle = { regNo: 'All Vehicle', type: '', vehicle_id: 'all' }
const UNASSIGNED_PIPES_OPTION: Vehicle = { regNo: 'Pipes in Stock', type: '', vehicle_id: 'unassigned' }
const ALL_GODOWN_OPTION: Godown = { godownType: 'All', godown_id: 'all' };

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
    pipeDataCountUrl;
    pipeData = [];
    loading = true;
    @ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;
    selectedVehicle: Vehicle;
    selectedPipe: PipeSize;
    selectedGodown: Godown;
    vehicles: Vehicle[];
    pipes: PipeSize[];
    godowns: Godown[];
    errorOccured;
    vehicleDisabled;
    countLoading;
    count;
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
        private loader: LoaderService,
    ) {
        this.pipeDataBatchUrl = this.config.getAbsoluteUrl('PipeData');
        this.pipeDataCountUrl = this.config.getAbsoluteUrl('pipeDataCount');

        this.routeParamsSubscription = this.route.paramMap.subscribe((paramMap) => {
            this.pipeType = paramMap.get('pipeType');
            this.pipeSize = paramMap.get('pipeSize');
        });

        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.vehicles = data.vehicles;
            this.godowns = data.godowns;
            this.pipes = data.pipes;
            this.vehicles.unshift(UNASSIGNED_PIPES_OPTION);
            this.vehicles.unshift(ALL_VEHICLE_OPTION);
            this.godowns.unshift(ALL_GODOWN_OPTION);
            this.selectedVehicle = this.vehicles[0];
            this.selectedGodown = this.godowns[0];
            this.selectedPipe = this.pipes.find(pipe => pipe.size == this.pipeSize);
            this.getPipeDataCount().subscribe((count) => {
                this.count = count
            })
        })

        


        const batchMap = this.offset.pipe(

            throttleTime(500),
            tap(() => {
                // console.log('throttle')
            }),
            exhaustMap(n => this.getPipeData(n).pipe(materialize())),
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
                // console.log('source', d)
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

    change() {
        this.offset.next(null);
        this.countLoading = true;
        this.getPipeDataCount().subscribe((count) => {
            this.count = count
        })
    }

    downloadPdf() {
        const pipeDataurl = this.config.getReportGenerateUrl('pipeData');
        const reportDownloadUrl = this.config.getReportDownloadUrl();
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('godown_type', this.selectedGodown.godownType)
            .append('godown_id', this.selectedGodown.godown_id)
            .append('vehicle_id', this.selectedVehicle.vehicle_id)
            .append('vehicle_no', this.selectedVehicle.regNo)
            .append('pipe_size', this.selectedPipe.size)
            .append('pipe_type', this.selectedPipe.type)
            .append('mm_count', this.count.mm_count)
            .append('rr_count', this.count.rr_count)
            .append('total_count', this.count.total_count)
            .append('start', '0')
            .append('end', '10000')
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

    getPipeDataCount() {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('pipe_size', this.selectedPipe.size)
            .append('vehicle_id', this.selectedVehicle.vehicle_id)
        return this.http.get<any[]>(this.pipeDataCountUrl, { params }).pipe(
            finalize(() => {
                this.countLoading = false;
            })
        )        
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
            .append('pipe_size', this.selectedPipe.size)
            .append('godown_id', this.selectedGodown.godown_id)
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