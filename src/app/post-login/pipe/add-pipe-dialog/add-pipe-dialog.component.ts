import { Component, Inject, ViewChildren, QueryList, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup, FormControl, NgControl, FormControlName, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelect, MatSelectChange, MatInput, MatStepper } from '@angular/material';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader-service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
    templateUrl: './add-pipe-dialog.component.html',
    styleUrls: ['./add-pipe-dialog.component.scss']
})
export class AddPipeDialogComponent {
    appearance;
    godownTypes = [];
    form: FormGroup;
    stepIndex = 0

    pipes = [
        { type: '4\'\'4 kg', groupName: 'p_4Inch4Kg', key: 'p_4Inch4Kg1', count: '0' },
        { type: '4\'\'6 kg', groupName: 'p_4Inch6Kg', key: 'p_4Inch6Kg1', count: '0' },
        { type: '5\'\'6 kg', groupName: 'p_5Inch6Kg', key: 'p_5Inch6Kg1', count: '0' },
        { type: '5\'\'8 kg', groupName: 'p_5Inch8Kg', key: 'p_5Inch8Kg1', count: '0' },
        { type: '7\'\'6 kg', groupName: 'p_7Inch6Kg', key: 'p_7Inch6Kg1', count: '0' },
        { type: '7\'\'8 kg', groupName: 'p_7Inch8Kg', key: 'p_7Inch8Kg1', count: '0' },
        { type: '8\'\'4 kg', groupName: 'p_8Inch4Kg', key: 'p_8Inch4Kg1', count: '0' },
        { type: '11\'\'4 kg', groupName: 'p_11Inch4Kg', key: 'p_11Inch4Kg1', count: '0' },
    ]

    postUrl;
    getPipeUrl;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private data,
        private http: HttpClient,
        private tostr: ToastrService,
        private dialogRef: MatDialogRef<AddPipeDialogComponent>,
        private auth: AuthService,
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.postUrl = this.config.getAbsoluteUrl('addPipe');
        this.getPipeUrl = this.config.getAbsoluteUrl('pipeCount') + '/' + this.auth.userid;
        this.godownTypes = data.godownTypes;
        this.form = this.fb.group({
            billNo: ['', Validators.required],
            godownType: '',
            remarks: ''
        })
        this.pipes.forEach(pipe => {
            this.form.addControl(pipe.groupName, this.buildPipeForm(pipe.count))
        })
    }

    savePipe() {
        const formValue = this.form.value;
        this.pipes.forEach(pipe => {
            formValue[pipe.groupName].count === '' ? formValue[pipe.groupName].count = '0' : ''
        })
        console.log(JSON.stringify(formValue, null, 2));
        this.http.post(this.postUrl, formValue).subscribe((response) => {
            this.tostr.success('Pipe Information added successfully', null, { timeOut: 2000 });
            this.dialogRef.close(response);
        }, (err) => {
            if (err) {
                this.tostr.error('Error while saving Pipe Information', null, { timeOut: 1500 });
            }
        })
    }

    stepChange(event: StepperSelectionEvent) {
        console.log(event)
    }

    private buildPipeForm(start) {
        // console.log(start)
        return this.fb.group({ count: '', start, end: start })
    }
}