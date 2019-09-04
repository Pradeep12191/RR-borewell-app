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
                path: '', component: HeaderComponent, outlet: 'header',
                resolve: {
                    userInfo: UserInfoResolver
                }
            },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'vehicle', loadChildren: () => import('./vehicle/vehicle.module').then(mod => mod.VehicleModule) },
            { path: 'pointDetails', loadChildren: () => import('./point-details/point-entry/point-entry.module').then(mod => mod.PointEntryModule) },
            { path: 'rpmDetails', loadChildren: () => import('./point-details/rpm-entry/rpm-entry.module').then(mod => mod.RpmEntryModule) },
            { path: '**', component: S404Component }
        ]
    }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostLoginRoutingModule {

}