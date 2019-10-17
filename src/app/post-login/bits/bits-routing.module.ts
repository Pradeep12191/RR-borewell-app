import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BitsComponent } from './bits.component';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';
import { BitListResolver } from '../../guards/resolveGuard/bit/bit-list.resolver';
import { BitCompaniesResolver } from '../../guards/resolveGuard/bit/bit-companies.resolver';
import { BitSizeListResolver } from '../../guards/resolveGuard/bit/bit-size-list.resolver';
import { BitLastSerialNoResolver } from '../../guards/resolveGuard/bit/bit-last-serial-no.resolver';

const routes: Routes = [
    {
        path: '', component: BitsComponent, resolve: {
            bitData: BitListResolver,
            companies: BitCompaniesResolver,
            bitSizes: BitSizeListResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitsRoutingModule {

}