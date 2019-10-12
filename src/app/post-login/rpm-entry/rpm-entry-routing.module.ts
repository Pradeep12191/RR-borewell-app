import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { RpmEntryComponent } from './rpm-entry-component';
import { PipeSizesResolver } from '../../guards/resolveGuard/select-option/pipe-sizes.resolver';
import { VehicleListResolver } from '../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';
import { BitGodownsResolver } from '../../guards/resolveGuard/bit/bit-godowns.resolver';
import { BitSizeListResolver } from '../../guards/resolveGuard/bit/bit-size-list.resolver';

const routes: Routes = [
    {
        path: '', component: RpmEntryComponent, resolve: {
            pipes: PipeSizesResolver,
            vehicles: VehicleListResolver,
            godowns: GodownTypesResolver,
            bitGodowns: BitGodownsResolver,
            bits: BitSizeListResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RpmEntryRoutingModule {

}