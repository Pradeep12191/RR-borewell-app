import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipeDataComponent } from './pipe-data.component';
import { VehicleListResolver } from '../../../guards/resolveGuard/vehicle/vehicle-list.resolver';

const routes: Routes = [
    {
        path: '', component: PipeDataComponent, resolve: {
            vehicles: VehicleListResolver
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PipeDataRoutingModule {

}