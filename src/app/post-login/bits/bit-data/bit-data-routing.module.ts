import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitDataComponent } from './bit-data.component';
import { VehicleListResolver } from '../../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { BitSizeListResolver } from '../../../guards/resolveGuard/bit/bit-size-list.resolver';

const routes: Routes = [
    {
        path: '', component: BitDataComponent, resolve: {
            vehicles: VehicleListResolver,
            bits: BitSizeListResolver
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitDataRoutingModule {

}