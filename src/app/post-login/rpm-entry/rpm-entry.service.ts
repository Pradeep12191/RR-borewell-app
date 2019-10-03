import { Injectable } from '@angular/core';
import { Book } from '../../models/Book';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Vehicle } from '../../models/Vehicle';
import { AuthService } from '../../services/auth.service';
import { Pipe } from '../../models/Pipe';

@Injectable()
export class RpmEntryService {
    private bookPostUrl: string;
    private getLastRpmEntrySheetUrl: string;
    private postAssignVehicleUrl: string;
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private toastr: ToastrService,
        private auth: AuthService
    ) {
        this.bookPostUrl = this.config.getAbsoluteUrl('addBook');
        this.getLastRpmEntrySheetUrl = this.config.getAbsoluteUrl('vehicleLastRpmEntry');
        this.postAssignVehicleUrl = this.config.getAbsoluteUrl('AssignPipeToVehicle');
    }

    postBook(book: Book) {
        console.log(JSON.stringify(book, null, 2))
        return this.http.post<Book>(this.bookPostUrl, book).pipe(
            map((book) => {
                this.toastr.success('New Book created Successfully', null, { timeOut: 2000 })
                return book;
            }),
            catchError((err) => {
                if (err) {
                    this.toastr.error('Network Error while creating Book', null, { timeOut: 2000 })
                }
                return throwError(err);
            }),
        )
    }

    getLastRpmEntrySheet(vehicle: Vehicle) {
        const params = new HttpParams()
            .set('user_id', this.auth.userid)
            .append('vehicle_id', vehicle.vehicle_id)
        return this.http.get<any>(this.getLastRpmEntrySheetUrl, { params }).pipe(catchError((err) => {
            if (err) {
                this.toastr.error('Network Error While fetching last Rpm Entry for Vehicle ' + vehicle.regNo, null, { timeOut: 2000 })
            }
            return throwError(err)
        }))
    }

    postAssignVehicle(payload: any, vehicle: Vehicle) {
        console.log(JSON.stringify(payload, null, 2));
        return this.http.post<{serial_no: string; billno: string}[]>(this.postAssignVehicleUrl, payload).pipe(
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
}