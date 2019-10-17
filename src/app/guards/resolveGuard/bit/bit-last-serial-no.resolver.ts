import { Injectable } from '@angular/core';
import { AddBitService } from '../../../post-login/bits/add-bit-dialog/add-bit.service';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class BitLastSerialNoResolver implements Resolve<number> {
    constructor(
        private addBitService: AddBitService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return this.addBitService.getLastBitSerial()
    }
}