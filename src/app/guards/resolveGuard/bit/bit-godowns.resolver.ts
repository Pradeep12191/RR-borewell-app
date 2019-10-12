import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AddBitService } from '../../../post-login/bits/add-bit-dialog/add-bit.service';

export class BitListResolver implements Resolve<any>{
    constructor(
        private addBitService: AddBitService
    ) {
    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.addBitService.getGodowns();
    }
}