import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';



export class GodownTypesResolver implements Resolve<any>{
    url;
    constructor(
        private http: HttpClient,
        private config: ConfigService
    ) {
        this.url = this.config.getAbsoluteUrl('godownTypes');
    }
    resolve() {
        return this.http.get(this.url);
    }
}