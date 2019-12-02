import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BitLifeComponent } from './bit-life.component';

const routes: Routes = [
    {
        path: '', component: BitLifeComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitLifeRoutingModule {

}