import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BitLife } from 'src/app/models/BitLife';
import { Injectable } from '@angular/core';
import { BitService } from 'src/app/post-login/bits/bit.service';

@Injectable()
export class BitLifeResolver implements Resolve<BitLife> {

    constructor(
        private bitService: BitService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const serial_no = route.paramMap.get('serialNo');
        return this.bitService.getBitLife(serial_no);
    }
}