import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppService } from '../../services/app.service';
import { BoreType } from '../../models/BoreType';

@Injectable()
export class BoreTypesResolver implements Resolve<BoreType[]>{
    constructor(
        private app: AppService
    ) {
    }

    tractorsUrl;

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.app.getBoreTypes();
    }
}