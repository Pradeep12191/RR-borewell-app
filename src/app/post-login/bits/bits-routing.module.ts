import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BitsComponent } from './bits.component';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';
import { BitListResolver } from '../../guards/resolveGuard/bit/bit-list.resolver';

const routes: Routes = [
    {
        path: '', component: BitsComponent, resolve: {
            // godowns: GodownTypesResolver,
            bitData: BitListResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitsRoutingModule {

}