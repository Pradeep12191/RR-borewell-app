import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBillComponent } from './view-bill.component';
import { BillsResolver } from '../../guards/resolveGuard/bills.resolver';

const routes: Routes = [
    { path: '', component: ViewBillComponent, resolve: {
        bills: BillsResolver
    }}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewBillRoutingModule {

}