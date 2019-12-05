import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, BehaviorSubject, Observable, Subject } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Vehicle } from 'src/app/models/Vehicle';
import { HammerSize } from '../hammer-size.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HammersService } from '../hammers.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service';
import { distinctUntilChanged, debounceTime, switchMap, throttleTime, tap, exhaustMap, materialize, map } from 'rxjs/operators';
import { FADE_IN_ANIMATION } from 'src/app/animations';

const ALL_VEHICLE_OPTION: Vehicle = { regNo: 'All Vehicle', type: '', vehicle_id: 'all' }
const UNASSIGNED_PIPES_OPTION: Vehicle = { regNo: 'Hammers in Stock', type: '', vehicle_id: 'unassigned' }

@Component({
    templateUrl: './hammer-data.component.html',
    styleUrls: ['./hammer-data.component.scss'],
    animations: [FADE_IN_ANIMATION]
})
export class HammerDataComponent implements OnDestroy {
    // pipes: PipeData[];
    routeDataSubscription: Subscription;
    routeParamsSubscription: Subscription;
    hammerType;
    hammerSize;
    theEnd = false;
    batch = 100;
    offset = new BehaviorSubject(null);
    infinite: Observable<any>;
    pipeDataCountUrl;
    bitData = [];
    loading = true;
    @ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;
    @ViewChild('viewContainer', { static: false, read: ElementRef }) viewContainer: ElementRef;
    selectedVehicle: Vehicle;
    selectedHammer: HammerSize;
    vehicles: Vehicle[];
    hammers: HammerSize[];
    searchSerialNo = '';
    input$ = new Subject<any>();
    errorOccured;
    vehicleDisabled;
    countLoading;
    count;
    mainLoading;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private hammersService: HammersService,
        private toastr: ToastrService,
        private loader: LoaderService,
    ) {
        // this.pipeDataBatchUrl = this.config.getAbsoluteUrl('PipeData');
        // this.pipeDataCountUrl = this.config.getAbsoluteUrl('pipeDataCount');

        this.routeParamsSubscription = this.route.paramMap.subscribe((paramMap) => {
            this.hammerType = paramMap.get('hammerType');
            this.hammerSize = paramMap.get('hammerSize');
        });

        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.vehicles = data.vehicles;
            this.hammers = data.hammers;
            this.vehicles.unshift(UNASSIGNED_PIPES_OPTION);
            this.vehicles.unshift(ALL_VEHICLE_OPTION);
            this.selectedVehicle = this.vehicles[0];
            this.selectedHammer = this.hammers.find(pipe => pipe.size == this.hammerSize);
            this.hammersService.getHammerDataCount(
                this.selectedHammer.size,
                this.selectedVehicle.vehicle_id,
                this.searchSerialNo
            ).subscribe((count) => {
                this.count = count
            })
        })

        this.input$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            switchMap(() => {
                return this.hammersService.getHammerDataCount(
                    this.selectedHammer.size,
                    this.selectedVehicle.vehicle_id,
                    this.searchSerialNo
                )
            })
        ).subscribe((count) => {
            this.count = count;
            this.offset.next(null);
        })




        const batchMap = this.offset.pipe(
            throttleTime(500),
            tap(() => {
                // console.log('throttle')
            }),
            exhaustMap(n => this.getBitData(n).pipe(materialize())),
            tap((next) => {
                if (next.error) {
                    this.errorOccured = true;
                    this.loading = false;
                    this.mainLoading = false;
                    this.toastr.error('Error While Fetching Data...', null, { timeOut: 2000 })
                }
            }),
            map((batch) => {
                if (batch.error || !batch.hasValue) {
                    return [...this.bitData];
                }
                return [...this.bitData, ...batch.value]
            }),
            tap(d => {
                this.bitData = d;
                this.loading = false;
                this.mainLoading = false;
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
        this.mainLoading = true;
        this.offset.next(null);
        this.hammersService.getHammerDataCount(
            this.selectedHammer.size,
            this.selectedVehicle.vehicle_id,
            this.searchSerialNo
        ).subscribe((count) => {
            this.count = count
        })
    }

    downloadPdf() {
        // const pipeDataurl = this.config.getReportGenerateUrl('pipeData');
        // const reportDownloadUrl = this.config.getReportDownloadUrl();
        // const params = new HttpParams()
        //     .set('user_id', this.auth.userid)
        //     .append('godown_type', this.selectedGodown.godownType)
        //     .append('godown_id', this.selectedGodown.godown_id)
        //     .append('vehicle_id', this.selectedVehicle.vehicle_id)
        //     .append('vehicle_no', this.selectedVehicle.regNo)
        //     .append('pipe_size', this.selectedPipe.size)
        //     .append('pipe_type', this.selectedPipe.type)
        //     .append('mm_count', this.count.mm_count)
        //     .append('rr_count', this.count.rr_count)
        //     .append('total_count', this.count.total_count)
        //     .append('start', '0')
        //     .append('end', '10000')
        // this.loader.showSaveLoader('Generating report ...')
        // this.http.get<{ filename: string }>(pipeDataurl, { params: params }).pipe(finalize(() => {
        //     this.loader.hideSaveLoader()
        // })).subscribe(({ filename }) => {
        //     this.toastr.success('Report generated successfully', null, { timeOut: 2000 });
        //     console.log(filename);
        //     window.open(reportDownloadUrl + '/' + filename, '_blank');
        // }, (err) => {
        //     this.toastr.error('Error while generating report', null, { timeOut: 2000 });
        // })
    }

    onSerialNoSearch(e) {
        this.mainLoading = true;
        this.searchSerialNo = e.target.value
        this.input$.next(e.target.value)
    }

    backToHammers() {
        this.router.navigate(['postlogin', 'hammers']);
    }

    nextBatch($event, offset) {
        // offset last item in the list
        if (this.theEnd) {
            this.loading = false;
            return;
        }
        const end = this.viewport.getRenderedRange().end;
        const length = this.viewport.getDataLength();

        if (this.bitData.length < this.batch) {
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

    getBitData(next) {
        let end = '100';
        let start = '0'
        if (next === null) {
            this.mainLoading = true;
            this.bitData = [];
            this.theEnd = false;
            if (this.viewContainer) {
                (this.viewContainer.nativeElement as HTMLDivElement).scrollTo(0, 0)
            }
        } else {
            end = (this.batch + next).toString()
            start = next.toString();
        }

        return this.hammersService.getHammerData(
            this.selectedHammer.size,
            this.selectedVehicle.vehicle_id,
            this.searchSerialNo,
            start,
            end
        ).pipe(
            tap(arr => {
                this.loading = false;
                arr.length ? null : this.theEnd = true;
            })
        )
    }

    navigateToViewHammerLife(serial_no) {
        this.router.navigate(['postlogin/hammers/hammerLife', serial_no])
    }
}