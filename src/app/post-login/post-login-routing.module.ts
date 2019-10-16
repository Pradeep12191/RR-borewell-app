import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostLoginComponent } from './post-login.component';
import { S404Component } from '../404/404.component';
import { HeaderComponent } from '../header/header.component';
import { UserInfoResolver } from '../guards/resolveGuard/user-info.resolver';

const routes: Routes = [
    {
        path: '', component: PostLoginComponent, children: [
            {
                path: '', component: HeaderComponent, outlet: 'header'
            },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'vehicles', loadChildren: () => import('./vehicle/vehicle.module').then(mod => mod.VehicleModule) },
            { path: 'pipes', loadChildren: () => import('./pipe/pipe.module').then(mod => mod.PipeModule) },
            { path: 'viewBills', loadChildren: () => import('./view-bill/view-bill.module').then(mod => mod.ViewBillModule) },
            { path: 'assignVehicle', loadChildren: () => import('./pipe/assign-vehicle/assign-vehicle.module').then(mod => mod.AssignVehicleModule) },
            { path: 'viewPipeData/:pipeSize/:pipeType', loadChildren: () => import('./pipe/pipe-data/pipe-data.module').then(mod => mod.PipeDataModule) },
            { path: 'bits', loadChildren: () => import('./bits/bits.module').then(mod => mod.BitsModule) },
            { path: 'bits/viewBit', loadChildren: () => import('./bits/view-bit/view-bit.module').then(mod => mod.ViewBitModule) },
            { path: 'rpmEntry', loadChildren: () => import('./rpm-entry/rpm-entry.module').then(mod => mod.RpmEntryModule) },
            { path: 'rpmEntry/report', loadChildren: () => import('./rpm-entry-report/rpm-entry-report.module').then(mod => mod.RpmEntryReportModule) },
            { path: 'godownExchange', loadChildren: () => import('./godown-exchange/godown-exchange.module').then(mod => mod.GodownExchangeModule) },
            { path: '**', component: S404Component }
        ],
        resolve: {
            userInfo: UserInfoResolver
        }
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostLoginRoutingModule {

}