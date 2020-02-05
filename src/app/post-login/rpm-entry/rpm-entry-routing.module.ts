import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { RpmEntryComponent } from './rpm-entry-component';
import { PipeSizesResolver } from '../../guards/resolveGuard/select-option/pipe-sizes.resolver';
import { VehicleListResolver } from '../../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';
import { BitGodownsResolver } from '../../guards/resolveGuard/bit/bit-godowns.resolver';
import { BitSizeListResolver } from '../../guards/resolveGuard/bit/bit-size-list.resolver';
import { RpmHourFeetResolver } from '../../guards/resolveGuard/rpm-hour-feet.resolver';
import { CompressorAirFilterLimitResolver } from '../../guards/resolveGuard/compressor-air-filter-service-limt.resolver';
import { TractorsResolver } from '../../guards/resolveGuard/tractors.resolver';
import { BoreTypesResolver } from '../../guards/resolveGuard/bore-types.resolver';
import { CompressorOilServiceLimitResolver } from '../../guards/resolveGuard/compresso-oil-service-limit.resolver';
import { HammerListResolver } from 'src/app/guards/resolveGuard/hammer/hammer-list.resolver';
import { AssignedBitsResolver } from 'src/app/guards/resolveGuard/assigned-bits.resolver';

const routes: Routes = [
    {
        path: '', component: RpmEntryComponent, resolve: {
            pipes: PipeSizesResolver,
            vehicles: VehicleListResolver,
            godowns: GodownTypesResolver,
            bitGodowns: BitGodownsResolver,
            bits: BitSizeListResolver,
            rpmHourFeets: RpmHourFeetResolver,
            compressorAirFilterServiceLimits: CompressorAirFilterLimitResolver,
            compressorOilServiceLimits: CompressorOilServiceLimitResolver,
            tractors: TractorsResolver,
            boreTypes: BoreTypesResolver,
            hammers: HammerListResolver,
            assignedBits: AssignedBitsResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RpmEntryRoutingModule {

}