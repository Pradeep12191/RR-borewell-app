import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ConfigService } from '../../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from '../Company';
import { map, catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { BitSize } from '../BitSize';
import { LoaderService } from '../../../services/loader-service';
import { Godown } from '../../pipe/Godown';
import { BitData } from '../view-bit/BitData';

@Injectable()
export class AddBitService {
    private getCompanyUrl: string;
    private addCompanyUrl: string;
    private bitSizeListUrl: string;
    private lastBitUrl: string;
    private addBitUrl: string;
    private bitsCountUrl: string;
    private godownUrl: string;
    private viewBitUrl: string;
    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private config: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService,
        private loader: LoaderService
    ) {
        this.getCompanyUrl = this.config.getAbsoluteUrl('bitCompanies')
        this.addCompanyUrl = this.config.getAbsoluteUrl('addBitCompany');
        this.bitSizeListUrl = this.config.getAbsoluteUrl('bitSizes');
        this.lastBitUrl = this.config.getAbsoluteUrl('lastBitSerialNo');
        this.addBitUrl = this.config.getAbsoluteUrl('addBit');
        this.bitsCountUrl = this.config.getAbsoluteUrl('bitsCount');
        this.godownUrl = this.config.getAbsoluteUrl('bitGodowns');
        this.viewBitUrl = this.config.getAbsoluteUrl('viewBit');
    }

    getCompanies() {
        const params = new HttpParams().set('user_id', this.auth.userid);
        return this.http.get<Company[]>(this.getCompanyUrl, { params })
    }

    getGodowns() {
        return this.http.get<Godown[]>(this.godownUrl)
    }

    getViewBitList() {
        const params = new HttpParams().set('user_id', this.auth.userid);
        return this.http.get<BitData[]>(this.viewBitUrl, { params })
    }

    getBitSizes() {
        return this.http.get<BitSize[]>(this.bitSizeListUrl)
    }

    getLastBitSerial(pipeSize) {
        this.loader.showSaveLoader('Fetching Last bit serial no.')
        const params = new HttpParams().set('pipe_size', pipeSize).append('user_id', this.auth.userid);
        return this.http.get<number>(this.lastBitUrl, { params }).pipe(
            finalize(() => this.loader.hideSaveLoader()),
            catchError((err) => {
                if (err) {
                    this.toastr.error('Error while Fetching last bit serial no', null, { timeOut: 2000 })
                }
                return throwError(err);
            })
        )
    }

    getBitsCount(godownId) {
        const params = new HttpParams().set('user_id', this.auth.userid).append('godown_id', godownId);
        return this.http.get<BitSize[]>(this.bitsCountUrl, { params });
    }

    addBitCompany(company: Company) {
        return this.http.post<Company>(this.addCompanyUrl, company).pipe(
            map((company) => {
                this.toastr.success('Company Added Successfully');
                return company;
            },
                catchError((err) => {
                    if (err) {
                        this.toastr.error('Error while adding company');
                    }
                    return throwError(err);
                })
            )
        )
    }

    addBit(payload) {
        this.loader.showSaveLoader('Saving Bit...');
        return this.http.post(this.addBitUrl, payload).pipe(
            finalize(() => this.loader.hideSaveLoader()),
            catchError((err) => {
                if (err) {
                    this.toastr.error('Error while saving Bit', null, { timeOut: 2000 });
                }
                return throwError(err)
            })
        )
    }

    buildPipeForm(serialNo, bit, company) {
        return this.fb.group({ serialNo, bit, company, bitNo: '' })
    }
}