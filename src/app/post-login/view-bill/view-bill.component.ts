import { Component, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Column } from '../../expand-table/Column';
import { MatTableDataSource } from '@angular/material';
import { ConfigService } from '../../services/config.service';
import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map, finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader-service';

@Component({
    templateUrl: 'view-bill.component.html',
    styleUrls: ['view-bill.component.scss'],
})
export class ViewBillComponent implements OnDestroy {
    routeSubcsription: Subscription;
    bills;
    billDataSource: MatTableDataSource<any>;
    appearance;
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'billNo', name: 'Bill Number', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'godowntype1', name: 'Godown', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'company1', name: 'Company', type: 'string', width: '15', isCenter: true, style: { fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' } },
        { id: 'date', name: 'Date', type: 'string', width: '25', style: { fontSize: '20px', fontWeight: 'bold' } },
        { id: 'more_details', name: 'Collapse All', type: 'toggle', width: '20', isCenter: true }
    ];
    selectedGodownId;
    godowns;
    billNo;
    billNoLoading;
    billNoDisabled;
    godownTypeLoading;
    godownTypeDisabled;
    searchBillNoUrl;
    expandAll;
    constructor(
        private route: ActivatedRoute,
        private config: ConfigService,
        private app: AppService,
        private auth: AuthService,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private loader: LoaderService
    ) {
        this.selectedGodownId = this.app.selectedGodownId ? this.app.selectedGodownId.toString() : '1';
        this.appearance = this.config.getConfig('formAppearance');
        this.route.data.subscribe(data => {
            this.bills = data.bills;
            this.godowns = data.godownTypes;
            this.billDataSource = new MatTableDataSource(data.bills);
        });
        this.searchBillNoUrl = this.config.getAbsoluteUrl('bills');
        this.expandAll = true;

    }

    pipeAddedDisplay(pipe) {
        if (pipe) {
            let start = pipe.start ? +pipe.start : 0;
            const end = pipe.end ? +pipe.end : 0;
            if (start === end) {
                return start;
            }
            return `(${start} - ${end})`;
        }
        return '0'
    }

    ngOnDestroy() {
        if (this.routeSubcsription) { this.routeSubcsription.unsubscribe(); }
    }

    displayGodownLabel(id) {
        return this.godowns.find(godown => godown.godown_id == id).godownType
    }

    downloadPdf() {

        const billReportUrl = this.config.getReportGenerateUrl('bills');
        const reportDownloadUrl = this.config.getReportDownloadUrl();
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('godown_id', this.selectedGodownId)
            .append('start', '0')
            .append('end', '200')
        this.loader.showSaveLoader('Generating report ...')
        this.http.get<{ filename: string }>(billReportUrl, { params: params }).pipe(finalize(() => {
            this.loader.hideSaveLoader()
        })).subscribe(({ filename }) => {
            this.toastr.success('Report generated successfully', null, { timeOut: 2000 });
            console.log(filename);
            window.open(reportDownloadUrl + '/' + filename, '_blank');
        }, (err) => {
            
            this.toastr.error('Error while generating report', null, { timeOut: 2000 });
        })

        // const options = { responseType:  };
        // return this.http.get('http://localhost:3001/bills-report', { responseType: 'arraybuffer' })
        // .pipe(map((res) => {
        //     // return res;
        //     return new Blob([res], { type: 'application/pdf' });
        // })).subscribe((res) => {
        //     // const fileURL = URL.createObjectURL(res);
        //     // window.open(fileURL, '_blank');
        //     const a = document.createElement('a');
        //     a.hidden = true;
        //     a.href =  URL.createObjectURL(res);
        //     a.click();
        //     // const reader = new FileReader();
        //     // reader.readAsArrayBuffer(res as Blob);
        //     // reader.onloadend = () => {
        //     //     const a = document.createElement('a');
        //     //     a.hidden = true;
        //     //     a.href =  URL.createObjectURL(reader.result);
        //     //     a.click();
        //     // }
        // }, (err) => {
        //     console.log(err)
        // })
        // window.open('http://localhost:3001/bills-report');
        // this.http.get('').subscribe(() => {

        // }, (err) => {
        //     console.log(err)
        // })
    }

    onBillNoChange(name) {
        if (name === 'billNo') {
            this.billNoDisabled = true;
            this.billNoLoading = true;
        } else {
            this.godownTypeLoading = true;
            this.godownTypeDisabled = true;
            this.app.selectedGodownId = this.selectedGodownId;
        }
        let params = new HttpParams().append('user_id', this.auth.userid)
        params = params.append('start', '0');
        params = params.append('end', '100');
        if (this.billNo) {
            params = params.append('billno', this.billNo)
        }
        params = params.append('gudown_id', this.selectedGodownId)
        this.http.get<any>(this.searchBillNoUrl, { params })
            .subscribe((bills) => {
                this.bills = bills;
                this.billDataSource = new MatTableDataSource(this.bills);
                this.billNoDisabled = false;
                this.billNoLoading = false;
                this.godownTypeDisabled = false;
                this.godownTypeLoading = false;
            }, (err) => {
                if (err) {
                    this.toastr.error('Error while searching Bill No', null, { timeOut: 1500 })
                }
                this.billNoDisabled = false;
                this.billNoLoading = false;
                this.godownTypeDisabled = false;
                this.godownTypeLoading = false;
            })
    }

    isEmptyObj(obj) {
        if (obj) {
            Object.entries(obj).length === 0 && obj.constructor === Object
        }
        return true;
    }

    backToPipes() {
        this.router.navigate(['postlogin', 'pipes'])
    }
}