import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HammersService } from 'src/app/post-login/hammers/hammers.service';
import { switchMap } from 'rxjs/operators';
import { HammerSize } from 'src/app/post-login/hammers/hammer-size.model';

export class HammerListResolver implements Resolve<any>{
    constructor(
        private hammersService: HammersService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HammerSize[]> {
      return  this.hammersService.getGodowns().pipe(
            switchMap((godowns) => {
                const godownId = godowns[0].godown_id
                return this.hammersService.getAll(godownId)
            })
        )
    }
}