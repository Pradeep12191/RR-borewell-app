import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RpmEntryService } from '../../post-login/rpm-entry/rpm-entry.service';
import { BitSerialNo } from 'src/app/models/BitSerialNo';
import { AppService } from 'src/app/services/app.service';
import { of } from 'rxjs';

@Injectable()
export class AssignedBitsResolver implements Resolve<BitSerialNo[]>{

    constructor(
        private rpmEntryService: RpmEntryService,
        private app: AppService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (this.app.rpmEntryData.selectedVehcileId) {
            return this.rpmEntryService.getAssignedBits({ vehicle_id: this.app.rpmEntryData.selectedVehcileId, type: '', regNo: '' });
        }
        return of([])
    }
}