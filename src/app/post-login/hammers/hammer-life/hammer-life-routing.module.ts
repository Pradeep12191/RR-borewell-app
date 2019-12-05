import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { HammerLifeComponent } from './hammer-life.component';
import { HammerLifeResolver } from 'src/app/guards/resolveGuard/hammer/hammer-life.reolver';

const routes: Routes = [
    {
        path: '', component: HammerLifeComponent, resolve: {
            hammers: HammerLifeResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HammerLifeRoutingModule {

}