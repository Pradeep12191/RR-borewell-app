import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ConfigService } from '../../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from '../Company';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { BitSize } from '../BitSize';

@Injectable()
export class AddBitService {
    private getCompanyUrl: string;
    private addCompanyUrl: string;
    private bitSizeListUrl: string;
    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private config: ConfigService,
        private http: HttpClient,
        private toastr: ToastrService
    ) {
        this.getCompanyUrl = this.config.getAbsoluteUrl('bitCompanies')
        this.addCompanyUrl = this.config.getAbsoluteUrl('addBitCompany');
        this.bitSizeListUrl = this.config.getAbsoluteUrl('bitSizes');
    }

    getCompanies() {
        const params = new HttpParams().set('user_id', this.auth.userid);
        return this.http.get<Company[]>(this.getCompanyUrl, { params })
    }

    getBitSizes() {
        return this.http.get<BitSize[]>(this.bitSizeListUrl)
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

    buildPipeForm(serialNo, bit, company) {
        return this.fb.group({ serialNo, bit, company, bitNo: '' })
    }
}