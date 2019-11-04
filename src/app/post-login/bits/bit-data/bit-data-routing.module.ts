import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitDataComponent } from './bit-data.component';

const routes: Routes = [
    {
        path: '', component: BitDataComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BitDataRoutingModule {

}