import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { RpmEntryReportComponent } from './rpm-entry-report.component';
import { RpmEntryReportResolver } from '../../guards/resolveGuard/rpmEntry/rpm-entry-report.resolve';
import { PipeSizesResolver } from '../../guards/resolveGuard/select-option/pipe-sizes.resolver';
import { CompressorAirFilterLimitResolver } from '../../guards/resolveGuard/compressor-air-filter-service-limt.resolver';

const routes: Routes = [
    {
        path: '', component: RpmEntryReportComponent, resolve: {
            entries: RpmEntryReportResolver,
            pipes: PipeSizesResolver
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RpmEntryReportRoutingModule {

}