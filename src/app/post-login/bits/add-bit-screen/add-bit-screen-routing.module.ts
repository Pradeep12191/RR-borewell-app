import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBitScreenComponent } from './add-bit-screen.component';

const routes: Routes = [
    {
        path: '', component: AddBitScreenComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddBitScreenRoutingModule {

}