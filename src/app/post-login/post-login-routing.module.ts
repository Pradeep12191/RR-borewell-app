import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostLoginComponent } from './post-login.component';
import { S404Component } from '../404/404.component';
import { HeaderComponent } from '../header/header.component';
import { UserInfoResolver } from '../guards/resolveGuard/user-info.resolver';
import { ErrorComponent } from '../error/error.component';

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
            { path: 'viewBitData/:bitSize/:bitType', loadChildren: () => import('./bits/bit-data/bit-data.module').then(mod => mod.BitDataModule) },
            { path: 'viewHammerData/:hammerSize/:hammerType', loadChildren: () => import('./hammers/hammer-data/hammer-data.module').then(mod => mod.HammerDataModule) },
            { path: 'bits', loadChildren: () => import('./bits/bits.module').then(mod => mod.BitsModule) },
            { path: 'bits/viewBit', loadChildren: () => import('./bits/view-bit/view-bit.module').then(mod => mod.ViewBitModule) },
            { path: 'bits/bitLife/:serialNo', loadChildren: () => import('./bits/bit-life/bit-life.module').then(mod => mod.BitLifeModule) },
            { path: 'bitsExchangeVehicle', loadChildren: () => import('./bit-vehicle-exchange/bit-vehicle-exchange.module').then(mod => mod.BitVehicleExchangeModule) },
            { path: 'rpmEntry', loadChildren: () => import('./rpm-entry/rpm-entry.module').then(mod => mod.RpmEntryModule) },
            { path: 'rpmEntryReport', loadChildren: () => import('./rpm-entry-report/rpm-entry-report.module').then(mod => mod.RpmEntryReportModule) },
            { path: 'godownExchange', loadChildren: () => import('./godown-exchange/godown-exchange.module').then(mod => mod.GodownExchangeModule) },
            { path: 'hammers', loadChildren: () => import('./hammers/hammers.module').then(mod => mod.HammersModule) },
            { path: 'hammers/viewHammers', loadChildren: () => import('./hammers/view-hammers/view-hammers.module').then(mod => mod.ViewHammersModule) },
            { path: 'hammers/hammerLife/:serialNo', loadChildren: () => import('./hammers/hammer-life/hammer-life.module').then(mod => mod.HammerLifeModule) },
            { path: 'error', component: ErrorComponent },
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