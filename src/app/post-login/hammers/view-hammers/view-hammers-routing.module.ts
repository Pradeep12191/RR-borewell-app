import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { ViewHammersComponent } from './view-hammers.component';
import { ViewHammersResolver } from './view-hammers.resolver';

const routes: Routes = [
    {
        path: '', component: ViewHammersComponent, resolve: {
            hammers: ViewHammersResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewHammersRoutingModule {

}