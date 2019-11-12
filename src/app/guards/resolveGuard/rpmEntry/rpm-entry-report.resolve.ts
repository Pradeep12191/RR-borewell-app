import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RpmEntryReportService } from '../../../post-login/rpm-entry-report/rpm-entry-report.service';
import { RpmEntrySheet } from '../../../models/RpmEntrySheet';

@Injectable()
export class RpmEntryReportResolver implements Resolve<RpmEntrySheet[]>{

    constructor(
        private rpmEntryRerportService: RpmEntryReportService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> | Observable<any> {
        const vehicle_id = route.queryParamMap.get('vehicleId');
        return this.rpmEntryRerportService.getRpmEntries({ vehicle_id });
    }
}