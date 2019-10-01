import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { GodownExchangeComponent } from './godown-exchange.component';

const routes: Routes = [
    {
        path: '', component: GodownExchangeComponent,
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GodownExchangeRoutingModule {

}