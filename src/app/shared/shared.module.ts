import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ServiceCompleteConfirmDialog } from '../post-login/rpm-entry/service-complete-confirm-dialog/service-complete-confirm-dialog.component';

@NgModule({
    declarations: [
        MonthPickerComponent,
        ServiceCompleteConfirmDialog,
    ],
    imports: [
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule
    ],
    exports: [
        TranslateModule,
        MonthPickerComponent,
        ServiceCompleteConfirmDialog
    ],
    entryComponents: [
        ServiceCompleteConfirmDialog
    ]
})
export class SharedModule {

}