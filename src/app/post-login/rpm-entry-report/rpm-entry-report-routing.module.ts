import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { RpmEntryReportComponent } from './rpm-entry-report.component';
import { RpmEntryReportResolver } from '../../guards/resolveGuard/rpmEntry/rpm-entry-report.resolve';

const routes: Routes = [
    {
        path: '', component: RpmEntryReportComponent, resolve: {
            entries: RpmEntryReportResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RpmEntryReportRoutingModule {

}