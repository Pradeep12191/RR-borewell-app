import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RpmEntryService } from '../../post-login/rpm-entry/rpm-entry.service';

@Injectable()
export class CompressorOilServiceLimitResolver implements Resolve<{ limit: number }[]>{

    constructor(
        private rpmEntryService: RpmEntryService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return this.rpmEntryService.getCompressorOilServiceLimits();
    }
}