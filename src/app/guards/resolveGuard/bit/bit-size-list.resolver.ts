import { Injectable } from '@angular/core';
import { AddBitService } from '../../../post-login/bits/add-bit-dialog/add-bit.service';
import { Resolve, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { BitSize } from '../../../post-login/bits/BitSize';

@Injectable()
export class BitSizeListResolver implements Resolve<BitSize[]> {
    constructor(
        private addBitService: AddBitService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return this.addBitService.getBitSizes()
    }
}