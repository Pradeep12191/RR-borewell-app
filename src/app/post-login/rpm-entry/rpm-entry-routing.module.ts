import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { RpmEntryComponent } from './rpm-entry-component';
import { PipeSizesResolver } from '../../guards/resolveGuard/select-option/pipe-sizes.resolver';

const routes: Routes = [
    {
        path: '', component: RpmEntryComponent, resolve: {
            pipes: PipeSizesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RpmEntryRoutingModule {

}