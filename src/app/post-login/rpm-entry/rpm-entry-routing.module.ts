import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { RpmEntryComponent } from './rpm-entry-component';
import { PipeSizesResolver } from '../../guards/resolveGuard/select-option/pipe-sizes.resolver';
import { VehicleListResolver } from '../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';

const routes: Routes = [
    {
        path: '', component: RpmEntryComponent, resolve: {
            pipes: PipeSizesResolver,
            vehicles: VehicleListResolver,
            godowns: GodownTypesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RpmEntryRoutingModule {

}