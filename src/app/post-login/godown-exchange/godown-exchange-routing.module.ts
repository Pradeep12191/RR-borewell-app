import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { GodownExchangeComponent } from './godown-exchange.component';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';
import { PipeSizesResolver } from '../../guards/resolveGuard/select-option/pipe-sizes.resolver';

const routes: Routes = [
    {
        path: '', component: GodownExchangeComponent, resolve: {
            godowns: GodownTypesResolver,
            pipes: PipeSizesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GodownExchangeRoutingModule {

}