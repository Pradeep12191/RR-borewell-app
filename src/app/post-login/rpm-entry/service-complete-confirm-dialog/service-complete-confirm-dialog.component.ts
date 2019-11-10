import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


@Component({
    templateUrl: './service-complete-confirm-dialog.component.html',
    styleUrls: ['./service-complete-confirm-dialog.component.scss']
})
export class ServiceCompleteConfirmDialog {
    message;
    title;
    constructor(
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.message = data.message
        this.title = data.title
    }
}