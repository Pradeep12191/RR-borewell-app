import { Injectable } from '@angular/core';
import { Book } from '../../models/Book';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class RpmEntryService {
    bookPostUrl;
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private toastr: ToastrService
    ) {
        this.bookPostUrl = this.config.getAbsoluteUrl('addBook');
    }

    postBook(book: Book) {
        return this.http.post<Book>(this.bookPostUrl, book).pipe(
            map((book) => {
                this.toastr.success('New Book created Successfully', null, { timeOut: 2000 })
                return book;
            }),
            catchError((err) => {
                if(err){
                    this.toastr.error('Network Error while creating Book', null, { timeOut: 2000 })
                }
                return throwError(err);
            }),
        )
    }
}