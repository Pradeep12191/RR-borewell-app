import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BitVehicleExchangeComponent } from './bit-vehicle-exchange.component';
import { VehicleListResolver } from '../../guards/resolveGuard/vehicle/vehicle-list.resolver';

const routes: Routes = [
    {
        path: '', component: BitVehicleExchangeComponent, resolve: {
            vehicles: VehicleListResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitVehicleExchangeRoutingModule {

}