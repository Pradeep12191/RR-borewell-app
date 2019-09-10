import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipeComponent } from './pipe.component';
import { PipesResolver } from '../../guards/resolveGuard/select-option/pipes.resolver';

const routes: Routes = [
    {
        path: '', component: PipeComponent, resolve: {
            pipeData: PipesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PipeRoutingModule {

}