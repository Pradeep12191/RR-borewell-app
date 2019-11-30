import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListResolver } from '../../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { HammerDataComponent } from './hammer-data.component';
import { HammerListResolver } from 'src/app/guards/resolveGuard/hammer/hammer-list.resolver';

const routes: Routes = [
    {
        path: '', component: HammerDataComponent, resolve: {
            vehicles: VehicleListResolver,
            hammers: HammerListResolver
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HammerDataRoutingModule {

}