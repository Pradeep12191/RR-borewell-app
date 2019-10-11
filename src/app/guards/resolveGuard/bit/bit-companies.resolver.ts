import { Injectable } from '@angular/core';
import { AddBitService } from '../../../post-login/bits/add-bit-dialog/add-bit.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Company } from '../../../post-login/bits/Company';

@Injectable()
export class BitCompaniesResolver implements Resolve<Company[]> {
    constructor(
        private addBitService: AddBitService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return this.addBitService.getCompanies();
    }
}