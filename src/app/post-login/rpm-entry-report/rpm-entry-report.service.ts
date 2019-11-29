import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RpmEntrySheet } from '../../models/RpmEntrySheet';
import { map, tap, catchError } from 'rxjs/operators';
import { RpmTableData } from '../../models/RpmTableData';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';


@Injectable()
export class RpmEntryReportService {
    rpmEntryReportUrl: string;
    reportUrl: string;
    pdfDownloadUrl: string
    constructor(
        private config: ConfigService,
        private http: HttpClient,
        private auth: AuthService,
        private toastr: ToastrService
    ) {
        this.rpmEntryReportUrl = this.config.getAbsoluteUrl('rpmReport');
        this.reportUrl = this.config.getReportGenerateUrl('rpmEntry');
        this.pdfDownloadUrl = this.config.getReportDownloadUrl();
    }

    downloadPdf(vehicleId: number) {

        const params = new HttpParams().set('user_id', this.auth.userid)
            .append('vehicle_id', vehicleId.toString());
        return this.http.get<{ success: string; filename: string }>(this.reportUrl, { params }).pipe(
            map((response) => {
                this.toastr.success('Report generated successfully', null, { timeOut: 2000 });
                window.open(this.pdfDownloadUrl + '/' + response.filename, '_blank');
                return response;
            }),
            catchError((err) => throwError(err))
        );
    }

    getRpmEntries(qParams: { [param: string]: string | string[] }) {
        const params = {
            user_id: this.auth.userid,
            ...qParams,
            bore_type: 'Bore Depth'
        }
        return this.http.get<RpmEntrySheet[]>(this.rpmEntryReportUrl, { params }).pipe(map((sheets) => {


            for (const sheet of sheets) {
                const rpmData: RpmTableData = {
                    availableStockFeet: [], balanceStockFeet: [], damageFeet: [],
                    mmIncome: [], rrIncome: [], pointExpenseFeet: [],
                    previousStockFeet: [], vehicleExIn: [], vehicleExOut: []
                }
                for (const rpm of sheet.f_rpm_table_data.reverse()) {
                    if (!rpm) continue;
                    const pipeData = {
                        pipeId: rpm.pipe_id,
                        pipeSize: rpm.pipe_size,
                        pipeType: rpm.pipe_type,
                    }
                    rpmData.previousStockFeet.push({ ...pipeData, feet: rpm.previous_stock_feet });
                    rpmData.damageFeet.push({ ...pipeData, feet: rpm.damage_feet });
                    rpmData.availableStockFeet.push({ ...pipeData, feet: rpm.available_stock_feet });
                    rpmData.balanceStockFeet.push({ ...pipeData, feet: rpm.balance_stock_feet });
                    rpmData.pointExpenseFeet.push({ ...pipeData, feet: rpm.point_expenses_feet });
                    rpmData.vehicleExOut.push({ ...pipeData, feet: rpm.vehicle_ex_out });
                    rpmData.vehicleExIn.push({ ...pipeData, feet: rpm.vehicle_ex_in });
                    rpmData.mmIncome.push({
                        ...pipeData,
                        length: rpm.mm_income,
                        feet: rpm.mm_income ? rpm.mm_income * 20 : 0
                    });
                    rpmData.rrIncome.push({
                        ...pipeData,
                        length: rpm.rr_income,
                        feet: rpm.rr_income ? rpm.rr_income * 20 : 0
                    })

                    sheet['rpmTableData'] = rpmData;
                }
            }

            return sheets

        }))
    }
}