import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BitLife } from 'src/app/models/BitLife';
import { Injectable } from '@angular/core';
import { HammersService } from 'src/app/post-login/hammers/hammers.service';

@Injectable()
export class HammerLifeResolver implements Resolve<BitLife> {

    constructor(
        private hammerService: HammersService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const serial_no = route.paramMap.get('serialNo');
        return this.hammerService.getHammerLife(serial_no);
    }
}