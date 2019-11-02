import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { RpmEntryService } from '../../post-login/rpm-entry/rpm-entry.service';
import { Tractor } from '../../models/Tractor';

@Injectable()
export class TractorsResolver implements Resolve<Tractor[]>{
    constructor(
        private rpm: RpmEntryService
    ) {
    }

    tractorsUrl;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.rpm.getTractors();
    }
}