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

@Component({
    templateUrl: 'view-bill.component.html',
    styleUrls: ['view-bill.component.scss']
})
export class ViewBillComponent implements OnDestroy {
    routeSubcsription: Subscription;
    bills;
    billDataSource: MatTableDataSource<any>;
    appearance;
    dataChanges = new Subject<any>();
    public columns: Column[] = [
        { id: 'serialNo', name: 'COLUMN.SERIAL_NO', type: 'index', width: '10' },
        { id: 'billNo', name: 'Bill Number', type: 'string', width: '20', isCenter: true, style: {fontSize: '20px', fontWeight: 'bold'} },
        { id: 'godowntype1', name: 'Godown', type: 'string', width: '30', isCenter: true, style: {fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase'} },
        { id: 'date', name: 'Date', type: 'string', width: '20',  style: {fontSize: '20px', fontWeight: 'bold'}},
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
        private router: Router
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
                this.dataChanges.next();
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