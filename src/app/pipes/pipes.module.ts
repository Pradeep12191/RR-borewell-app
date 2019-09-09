import { NgModule } from '@angular/core';
import { NullFilterPipe } from './nullFilter.pipe';
import { NewLinePipe } from './newLine.pipe';

@NgModule({
    declarations: [
        NullFilterPipe,
        NewLinePipe
    ],
    exports: [
        NullFilterPipe,
        NewLinePipe
    ]
})
export class PipesModule {

}