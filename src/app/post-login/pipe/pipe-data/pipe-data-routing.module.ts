import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipeDataComponent } from './pipe-data.component';

const routes: Routes = [
    { path: '', component: PipeDataComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PipeDataRoutingModule {

}