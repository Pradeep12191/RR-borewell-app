import { Injectable } from '@angular/core';
import { Book } from '../../models/Book';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Vehicle } from '../../models/Vehicle';
import { AuthService } from '../../services/auth.service';
import { Pipe } from '../../models/Pipe';
import { RpmEntrySheet } from '../../models/RpmEntrySheet';
import { RpmEntry } from '../../models/RpmEntry';
import { RpmTableData } from '../../models/RpmTableData';
import { PipeSize } from '../../models/PipeSize';
import { RpmValue } from '../../models/RpmValue';
import { FormBuilder } from '@angular/forms';

@Injectable()
export class RpmEntryService {
    private bookPostUrl: string;
    private getLastRpmEntrySheetUrl: string;
    private postAssignVehicleUrl: string;
    private rpmTableDataurl: string;
    private submitRpmUrl: string;
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private toastr: ToastrService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        this.bookPostUrl = this.config.getAbsoluteUrl('addBook');
        this.getLastRpmEntrySheetUrl = this.config.getAbsoluteUrl('vehicleLastRpmEntry');
        this.postAssignVehicleUrl = this.config.getAbsoluteUrl('AssignPipeToVehicle');
        this.rpmTableDataurl = this.config.getAbsoluteUrl('rpmTableData');
        this.submitRpmUrl = this.config.getAbsoluteUrl('submitRpmEntry');
    }

    postBook(book: Book) {
        console.log(JSON.stringify(book, null, 2))
        return this.http.post<Book>(this.bookPostUrl, book).pipe(
            map((book) => {
                this.toastr.success('New Book created Successfully', null, { timeOut: 2000 })
                return book;
            }),
            catchError((err: HttpErrorResponse) => {
                if (err) {
                    if (err.status === 422) {
                        this.toastr.error('Duplicate book error', null, { timeOut: 2000 })
                    } else {
                        this.toastr.error('Network Error while creating Book', null, { timeOut: 2000 })
                    }

                }
                return throwError(err);
            }),
        )
    }

    getLastRpmEntrySheet(vehicle: Vehicle) {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('vehicle_id', vehicle.vehicle_id)
        return this.http.get<RpmEntrySheet>(this.getLastRpmEntrySheetUrl, { params }).pipe(catchError((err) => {
            if (err) {
                this.toastr.error('Network Error While fetching last Rpm Entry for Vehicle ' + vehicle.regNo, null, { timeOut: 2000 })
            }
            return throwError(err)
        }))
    }

    updateAssignVehicle(payload: any, vehicle: Vehicle) {
        console.log(JSON.stringify(payload, null, 2));
        return this.http.put<{ serial_no: string; billno: string }[]>(this.postAssignVehicleUrl, payload).pipe(
            map((pipes) => {
                this.toastr.success('Pipes assigned to vehicle ' + vehicle.regNo + ' successfully')
                return pipes
            }),
            catchError((err) => {
                if (err) {
                    this.toastr.error('Error while assinging Pipe', null, { timeOut: 2000 })
                }
                return throwError(err);
            })
        )
    }

    getRpmTableData(vehicle: Vehicle, rpmEntryNo) {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('vehicle_id', vehicle.vehicle_id)
            .append('rpm_sheet_no', rpmEntryNo)
        return this.http.get<RpmEntrySheet>(this.rpmTableDataurl, { params }).pipe(map((data) => {
            const rpmData: RpmTableData = {
                availableStock: [], balanceStockFeet: [], damageFeet: [],
                mmIncome: [], rrIncome: [], pointExpenseFeet: [],
                previousStockFT: [], vehicleInOut: []
            }
            for (const rpm of data.f_rpm_table_data) {
                rpmData.previousStockFT.push({
                    pipeId: rpm.pipe_id,
                    pipeSize: rpm.pipe_size,
                    pipeType: rpm.pipe_type,
                    length: rpm.previous_stock_feet,
                    feet: rpm.previous_stock_feet ? rpm.previous_stock_feet * 20 : 0
                });
                rpmData.damageFeet.push({
                    pipeId: rpm.pipe_id,
                    pipeSize: rpm.pipe_size,
                    pipeType: rpm.pipe_type,
                    length: rpm.damage_feet,
                    feet: rpm.damage_feet ? rpm.damage_feet * 20 : 0
                });
                rpmData.mmIncome.push({
                    pipeId: rpm.pipe_id,
                    pipeSize: rpm.pipe_size,
                    pipeType: rpm.pipe_type,
                    length: rpm.mm_income,
                    feet: rpm.mm_income ? rpm.mm_income * 20 : 0
                });
                rpmData.rrIncome.push({
                    pipeId: rpm.pipe_id,
                    pipeSize: rpm.pipe_size,
                    pipeType: rpm.pipe_type,
                    length: rpm.rr_income,
                    feet: rpm.rr_income ? rpm.rr_income * 20 : 0
                })
                rpmData.availableStock.push({
                    pipeId: rpm.pipe_id,
                    pipeSize: rpm.pipe_size,
                    pipeType: rpm.pipe_type,
                    length: rpm.balance_stock_feet,
                    feet: rpm.balance_stock_feet ? rpm.balance_stock_feet * 20 : 0
                })
                rpmData.balanceStockFeet.push({
                    pipeId: rpm.pipe_id,
                    pipeSize: rpm.pipe_size,
                    pipeType: rpm.pipe_type,
                    length: rpm.balance_stock_feet,
                    feet: rpm.balance_stock_feet ? rpm.balance_stock_feet * 20 : 0
                }),
                    rpmData.vehicleInOut.push({
                        pipeId: rpm.pipe_id,
                        pipeSize: rpm.pipe_size,
                        pipeType: rpm.pipe_type,
                        length: rpm.vehicle_ex_out,
                        feet: rpm.vehicle_ex_out ? rpm.vehicle_ex_out * 20 : 0
                    })
            }
            return rpmData
        }), catchError((err) => {
            this.toastr.error('Error while Fetching RPM Entry')
            return throwError(err)
        }))
    }

    submitRpm(payload: RpmEntrySheet) {
        console.log(JSON.stringify(payload, null, 2))
        return this.http.put<RpmEntry>(this.submitRpmUrl, payload).pipe(map(() => {
            this.toastr.success('Rpm Saved Successfully', null, { timeOut: 3000 });
        }), catchError((err) => {
            return throwError(err)
        }))
    }

    buildPointExpenseForm(pipeType) {
        return this.fb.group({ pipeType, value: '' })
    }
}