import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { ViewBitComponent } from './view-bit.component';
import { ViewBitResolver } from '../../../guards/resolveGuard/bit/view-bit.resolver';

const routes: Routes = [
    {
        path: '', component: ViewBitComponent, resolve: {
            bits: ViewBitResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewBitRoutingModule {

}