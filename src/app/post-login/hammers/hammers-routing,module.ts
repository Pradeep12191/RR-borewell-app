import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HammersComponent } from './hammers.component';
import { HammersResolver } from './hammers.resolver';

const routes: Routes = [
    {
        path: '', component: HammersComponent, resolve: {
            hammers: HammersResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HammersRoutingModule {

}