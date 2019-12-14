import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BitLife } from 'src/app/models/BitLife';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoaderService } from 'src/app/services/loader-service';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './bit-life.component.html',
    styleUrls: ['./bit-life.component.scss']
})
export class BitLifeComponent implements OnDestroy, OnInit {
    routeDataSubscription: Subscription;
    bitLifes: BitLife[]
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private toastr: ToastrService,
        private loader: LoaderService,
        private config: ConfigService,
        private auth: AuthService,
        private http: HttpClient
    ) {

    }

    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.bitLifes = data.bits
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe() }
    }

    backToBit() {
        this.location.back()
    }

    downloadPdf() {
        if (this.bitLifes && this.bitLifes.length) {
            const bitLifeUrl = this.config.getReportGenerateUrl('bitLife');
            const reportDownloadUrl = this.config.getReportDownloadUrl();
            const params = new HttpParams()
                .set('user_id', this.auth.userid)
                .append('bit_no', this.bitLifes[0].bit_no.toString())
                .append('serial_no', this.bitLifes[0].serial_no.toString())
                .append('bit_type', this.bitLifes[0].bit_type)
                .append('companyName', this.bitLifes[0].company_name)
                .append('status', this.bitLifes[0].status ? 'Completed': 'Not completed')
            this.loader.showSaveLoader('Generating report ...')
            this.http.get<{ filename: string }>(bitLifeUrl, { params: params }).pipe(finalize(() => {
                this.loader.hideSaveLoader()
            })).subscribe(({ filename }) => {
                this.toastr.success('Report generated successfully', null, { timeOut: 2000 });
                console.log(filename);
                window.open(reportDownloadUrl + '/' + filename, '_blank');
            }, (err) => {
                this.toastr.error('Error while generating report', null, { timeOut: 2000 });
            })
        }

    }

}