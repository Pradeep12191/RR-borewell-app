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
            { path: 'pointDetails', loadChildren: () => import('./point-details/point-entry/point-entry.module').then(mod => mod.PointEntryModule) },
            { path: 'rpmDetails', loadChildren: () => import('./point-details/rpm-entry/rpm-entry.module').then(mod => mod.RpmEntryModule) },
            { path: 'viewBills', loadChildren: () => import('./view-bill/view-bill.module').then(mod => mod.ViewBillModule) },
            { path: 'assignVehicle/:pipeSize/:pipeType', loadChildren: () => import('./pipe/assign-vehicle/assign-vehicle.module').then(mod => mod.AssignVehicleModule) },
            { path: 'viewPipeData', loadChildren: () => import('./pipe/pipe-data/pipe-data.module').then(mod => mod.PipeDataModule) },
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