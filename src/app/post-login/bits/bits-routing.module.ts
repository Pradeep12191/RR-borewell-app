import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BitsComponent } from './bits.component';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';

const routes: Routes = [
    {
        path: '', component: BitsComponent, resolve: {
            godowns: GodownTypesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitsRoutingModule {

}