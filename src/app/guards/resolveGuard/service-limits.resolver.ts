import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RpmEntryService } from '../../post-login/rpm-entry/rpm-entry.service';
import { VehicleServices } from '../../models/VehicleServices';

@Injectable()
export class ServiceLimitsResolver implements Resolve<VehicleServices>{

    constructor(
        private rpmEntryService: RpmEntryService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        const vehicleId = route.queryParamMap.get('vehicleId');
        return this.rpmEntryService.getServiceLimitsByVehicleId(vehicleId);
    }
}