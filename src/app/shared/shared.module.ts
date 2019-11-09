import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        MonthPickerComponent
    ],
    imports: [
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule
    ],
    exports: [
        TranslateModule,
        MonthPickerComponent
    ]
})
export class SharedModule {

}