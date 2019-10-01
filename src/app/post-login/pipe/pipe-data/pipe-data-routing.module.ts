import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipeDataComponent } from './pipe-data.component';
import { VehicleListResolver } from '../../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { GodownTypesResolver } from '../../../guards/resolveGuard/select-option/godown-types.resolver';
import { PipeSizesResolver } from '../../../guards/resolveGuard/select-option/pipe-sizes.resolver';

const routes: Routes = [
    {
        path: '', component: PipeDataComponent, resolve: {
            vehicles: VehicleListResolver,
            godowns: GodownTypesResolver,
            pipes: PipeSizesResolver
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PipeDataRoutingModule {

}