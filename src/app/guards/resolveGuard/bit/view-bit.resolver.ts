import { Injectable } from '@angular/core';
import { AddBitService } from '../../../post-login/bits/add-bit-dialog/add-bit.service';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { BitData } from '../../../post-login/bits/view-bit/BitData';

@Injectable()
export class ViewBitResolver implements Resolve<BitData[]> {
    constructor(
        private addBitService: AddBitService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return this.addBitService.getViewBitList()
    }
}