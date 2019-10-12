import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AddBitService } from '../../../post-login/bits/add-bit-dialog/add-bit.service';
import { switchMap, map } from 'rxjs/operators';

export class BitListResolver implements Resolve<any>{
    constructor(
        private addBitService: AddBitService
    ) {
    }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.addBitService.getGodowns().pipe(
            switchMap((godowns) => {
                const godown = godowns[0].godown_id
                return this.addBitService.getBitsCount(godown).pipe(
                    map((bits) => {
                        return {
                            godowns,
                            bits
                        }
                    })
                )
            })
        )
    }
}