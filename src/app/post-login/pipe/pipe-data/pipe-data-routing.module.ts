import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipeDataComponent } from './pipe-data.component';
import { PipeDataResolver } from '../../../guards/resolveGuard/pipes/pipe-data.resolver';

const routes: Routes = [
    { path: '', component: PipeDataComponent, resolve: {
        pipes: PipeDataResolver
    } }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PipeDataRoutingModule {

}