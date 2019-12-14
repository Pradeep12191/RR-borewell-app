import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BitLife } from 'src/app/models/BitLife';
import { Location } from '@angular/common';
import { HttpParams, HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './hammer-life.component.html',
    styleUrls: ['./hammer-life.component.scss']
})
export class HammerLifeComponent implements OnDestroy, OnInit {
    routeDataSubscription: Subscription;
    hammerLifes: BitLife[]
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
            this.hammerLifes = data.hammers
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe() }
    }

    backToBit() {
        this.location.back()
    }

    downloadPdf() {
        if (this.hammerLifes && this.hammerLifes.length) {
            const bitLifeUrl = this.config.getReportGenerateUrl('hammerLife');
            const reportDownloadUrl = this.config.getReportDownloadUrl();
            const params = new HttpParams()
                .set('user_id', this.auth.userid)
                .append('serial_no', this.hammerLifes[0].serial_no.toString())
                .append('hammer_type', this.hammerLifes[0].bit_type)
                .append('companyName', this.hammerLifes[0].company_name)
                .append('status', this.hammerLifes[0].status ? 'Completed': 'Not completed')
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