import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';
import { RpmEntryService } from '../../post-login/rpm-entry/rpm-entry.service';
import { Vehicle } from '../../models/Vehicle';

@Injectable()
export class TractorsResolver implements Resolve<Vehicle[]>{
    constructor(
        private rpm: RpmEntryService
    ) {
    }

    tractorsUrl;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.rpm.getTractors();
    }
}