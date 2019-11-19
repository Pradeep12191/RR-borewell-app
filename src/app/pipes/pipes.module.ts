import { NgModule } from '@angular/core';
import { NullFilterPipe } from './nullFilter.pipe';
import { NewLinePipe } from './newLine.pipe';
import { StartsWithFilterPipe } from './starts-with-filter.pipe';
import { ReversePipe } from './reverse.pipe';
import { ConvertHours } from './convert-hours.pipe';

@NgModule({
    declarations: [
        NullFilterPipe,
        NewLinePipe,
        StartsWithFilterPipe,
        ReversePipe,
        ConvertHours
    ],
    exports: [
        NullFilterPipe,
        NewLinePipe,
        StartsWithFilterPipe,
        ReversePipe,
        ConvertHours
    ]
})
export class PipesModule {

}