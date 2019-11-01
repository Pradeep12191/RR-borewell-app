import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { A11yModule } from '@angular/cdk/a11y';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PostLoginRoutingModule } from './post-login-routing.module';
import { PostLoginComponent } from './post-login.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from '../header/header.component';
import { S404Component } from '../404/404.component';
import { MobileSidenavComponent } from './mobile-sidenav/mobile-sidenav.component';
import { StateResolver } from '../guards/resolveGuard/state.resolver';
import { UserInfoResolver } from '../guards/resolveGuard/user-info.resolver';
import { VehicleTypeResolver } from '../guards/resolveGuard/vehicle/vehicle-type.resolver';
import { VehicleListResolver } from '../guards/resolveGuard/vehicle/vehicle-list.resolver';
import { GodownTypesResolver } from '../guards/resolveGuard/select-option/godown-types.resolver';
import { OverlayCardService } from '../services/overlay-card.service';
import { CompanyiesResolver } from '../guards/resolveGuard/select-option/companies.resolver';
import { PipeSizesResolver } from '../guards/resolveGuard/select-option/pipe-sizes.resolver';
import { AddBookPopupComponent } from './rpm-entry/add-book-popup/add-book-popup.component';
import { ErrorComponent } from '../error/error.component';



@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        PostLoginRoutingModule,
        SharedModule,
        A11yModule
    ],
    declarations: [
        DashboardComponent,
        PostLoginComponent,
        HeaderComponent,
        S404Component,
        MobileSidenavComponent,
        AddBookPopupComponent,
        ErrorComponent
    ],
    providers: [
        StateResolver,
        UserInfoResolver,
        VehicleListResolver,
        VehicleTypeResolver,
        GodownTypesResolver,
        OverlayCardService,
        CompanyiesResolver,
        PipeSizesResolver,
    ],
    entryComponents: [
        AddBookPopupComponent
    ]
})
export class PostLoginModule {

}