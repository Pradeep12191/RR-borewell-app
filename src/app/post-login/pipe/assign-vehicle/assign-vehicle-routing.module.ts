import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignVehicleComponent } from './assign-vehicle.component';
import { VehicleListResolver } from '../../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { PipeSerialNosResolver } from '../../../guards/resolveGuard/pipes/pipe-serial-nos.resolver';

const routes: Routes = [
    {
        path: '', component: AssignVehicleComponent, resolve: {
            vehicles: VehicleListResolver,
            pipeSerialNos: PipeSerialNosResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignVehicleRoutingModule {

}