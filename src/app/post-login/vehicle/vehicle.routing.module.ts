import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleComponent } from './vehicle.component';
import { VehicleListResolver } from '../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { VehicleTypeResolver } from '../../guards/resolveGuard/vehicle/vehicle-type.resolver';

const routes: Routes = [
    {
        path: '', component: VehicleComponent, resolve: {
            vehicles: VehicleListResolver,
            vehicleTypes: VehicleTypeResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VehicleRoutingModule {

}