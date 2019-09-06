import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipeComponent } from './pipe.component';
import { GodownTypesResolver } from '../../guards/resolveGuard/select-option/godown-types.resolver';

const routes: Routes = [
    {
        path: '', component: PipeComponent, resolve: {
            pipeData: GodownTypesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PipeRoutingModule {

}