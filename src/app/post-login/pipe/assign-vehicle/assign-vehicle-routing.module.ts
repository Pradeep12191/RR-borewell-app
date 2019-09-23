import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignVehicleComponent } from './assign-vehicle.component';
import { VehicleListResolver } from '../../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { PipeSerialNosResolver } from '../../../guards/resolveGuard/pipes/pipe-serial-nos.resolver';
import { GodownTypesResolver } from '../../../guards/resolveGuard/select-option/godown-types.resolver';
import { PipeSizesResolver } from '../../../guards/resolveGuard/select-option/pipe-sizes.resolver';

const routes: Routes = [
    {
        path: '', component: AssignVehicleComponent, resolve: {
            vehicles: VehicleListResolver,
            godowns: GodownTypesResolver,
            pipeSizes: PipeSizesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignVehicleRoutingModule {

}