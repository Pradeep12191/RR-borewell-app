import { NgModule } from '@angular/core';
import { NullFilterPipe } from './nullFilter.pipe';
import { NewLinePipe } from './newLine.pipe';
import { StartsWithFilterPipe } from './starts-with-filter.pipe';
import { ReversePipe } from './reverse.pipe';

@NgModule({
    declarations: [
        NullFilterPipe,
        NewLinePipe,
        StartsWithFilterPipe,
        ReversePipe
    ],
    exports: [
        NullFilterPipe,
        NewLinePipe,
        StartsWithFilterPipe,
        ReversePipe
    ]
})
export class PipesModule {

}