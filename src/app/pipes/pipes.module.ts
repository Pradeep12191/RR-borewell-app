import { NgModule } from '@angular/core';
import { NullFilterPipe } from './nullFilter.pipe';
import { NewLinePipe } from './newLine.pipe';
import { StartsWithFilterPipe } from './starts-with-filter.pipe';

@NgModule({
    declarations: [
        NullFilterPipe,
        NewLinePipe,
        StartsWithFilterPipe
    ],
    exports: [
        NullFilterPipe,
        NewLinePipe,
        StartsWithFilterPipe
    ]
})
export class PipesModule {

}