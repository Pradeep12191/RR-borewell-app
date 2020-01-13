import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, BehaviorSubject, Observable, Subject } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { tap, throttleTime, map, materialize, exhaustMap, debounceTime, distinctUntilChanged, switchMap, finalize } from 'rxjs/operators';
import { FADE_IN_ANIMATION } from '../../../animations';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from '../../../models/Vehicle';
import { LoaderService } from '../../../services/loader-service';
import { BitData } from '../BitData';
import { BitSize } from '../BitSize';
import { BitService } from '../bit.service';
import { ConfigService } from 'src/app/services/config.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';

const ALL_VEHICLE_OPTION: Vehicle = { regNo: 'All Vehicle', type: '', vehicle_id: 'all' }
const UNASSIGNED_PIPES_OPTION: Vehicle = { regNo: 'Bits in Stock', type: '', vehicle_id: 'unassigned' }
// const ALL_GODOWN_OPTION: Godown = { godownType: 'All', godown_id: 'all' };

@Component({
    templateUrl: './bit-data.component.html',
    styleUrls: ['./bit-data.component.scss'],
    animations: [FADE_IN_ANIMATION]
})
export class BitDataComponent implements OnDestroy {
    // pipes: PipeData[];
    routeDataSubscription: Subscription;
    routeParamsSubscription: Subscription;
    bitType;
    bitSize;
    theEnd = false;
    batch = 100;
    offset = new Subject();
    infinite: Observable<any>;
    pipeDataCountUrl;
    bitData = [];
    loading = true;
    @ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;
    @ViewChild('viewContainer', { static: false, read: ElementRef }) viewContainer: ElementRef;
    selectedVehicle: Vehicle;
    selectedBit: BitSize;
    vehicles: Vehicle[];
    bits: BitSize[];
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
        private bitService: BitService,
        private toastr: ToastrService,
        private loader: LoaderService,
        private config: ConfigService,
        private auth: AuthService,
        private http: HttpClient,
        private app: AppService
    ) {
        // this.pipeDataBatchUrl = this.config.getAbsoluteUrl('PipeData');
        // this.pipeDataCountUrl = this.config.getAbsoluteUrl('pipeDataCount');

        this.routeParamsSubscription = this.route.paramMap.subscribe((paramMap) => {
            this.bitType = paramMap.get('bitType');
            this.bitSize = paramMap.get('bitSize');
        });

        this.routeDataSubscription = this.route.data.subscribe((data) => {

            let selectedVehicle = null;
            let selectedBit = null;
            this.vehicles = data.vehicles;
            this.bits = data.bits;
            this.vehicles.unshift(UNASSIGNED_PIPES_OPTION);
            this.vehicles.unshift(ALL_VEHICLE_OPTION);

            // set Search Data from app state
            if (this.app.bitDataSearch.vehicleId) {
                selectedVehicle = this.vehicles.find(v => v.vehicle_id === this.app.bitDataSearch.vehicleId);
            }
            if (this.app.bitDataSearch.bitSizeId) {
                selectedBit = this.bits.find(b => b.id === this.app.bitDataSearch.bitSizeId);
            }
            this.searchSerialNo = this.app.bitDataSearch.serialNo || ''

            this.selectedVehicle = selectedVehicle || this.vehicles[0];
            this.selectedBit = selectedBit || this.bits.find(pipe => pipe.size == this.bitSize);

            this.bitService.getBitDataCount(
                this.selectedBit.size,
                this.selectedVehicle.vehicle_id,
                this.searchSerialNo
            ).subscribe((count) => {
                this.offset.next(null);
                this.count = count
            })
        })

        this.input$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            switchMap(() => {
                return this.bitService.getBitDataCount(
                    this.selectedBit.size,
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
        this.app.bitDataSearch.vehicleId = this.selectedVehicle.vehicle_id;
        this.app.bitDataSearch.bitSizeId = this.selectedBit.id;
        this.bitService.getBitDataCount(
            this.selectedBit.size,
            this.selectedVehicle.vehicle_id,
            this.searchSerialNo
        ).subscribe((count) => {
            this.count = count
        })
    }

    downloadPdf() {
        const bitDataUrl = this.config.getReportGenerateUrl('bitData');
        const reportDownloadUrl = this.config.getReportDownloadUrl();
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('bit_type', this.selectedBit.type)
            .append('bit_size', this.selectedBit.size.toString())
            .append('vehicle_id', this.selectedVehicle.vehicle_id)
            .append('vehicle_no', this.selectedVehicle.regNo)
            .append('total_count', this.count)
            .append('start', '0')
            .append('end', '10000')
        this.loader.showSaveLoader('Generating report ...')
        this.http.get<{ filename: string }>(bitDataUrl, { params: params }).pipe(finalize(() => {
            this.loader.hideSaveLoader()
        })).subscribe(({ filename }) => {
            this.toastr.success('Report generated successfully', null, { timeOut: 2000 });
            console.log(filename);
            window.open(reportDownloadUrl + '/' + filename, '_blank');
        }, (err) => {
            this.toastr.error('Error while generating report', null, { timeOut: 2000 });
        })
    }

    onSerialNoSearch(e) {
        this.mainLoading = true;
        this.searchSerialNo = e.target.value;
        this.app.bitDataSearch.serialNo = this.searchSerialNo;
        this.input$.next(e.target.value)
    }

    backToBits() {
        this.router.navigate(['postlogin', 'bits']);
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

        return this.bitService.getBitData(
            this.selectedBit.size,
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

    navigateToViewBitLife(serial_no) {
        this.router.navigate(['/postlogin/bits/bitLife', serial_no])
    }
}