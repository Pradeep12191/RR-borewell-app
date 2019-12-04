import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BitLifeComponent } from './bit-life.component';
import { BitLifeResolver } from 'src/app/guards/resolveGuard/bit/bit-life.resolver';

const routes: Routes = [
    {
        path: '', component: BitLifeComponent, resolve: {
            bits: BitLifeResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitLifeRoutingModule {

}