import { Component, Inject, ViewChildren, QueryList, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup, FormControl, NgControl, FormControlName, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelect, MatSelectChange, MatInput, MatStepper } from '@angular/material';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader-service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Pipe } from '../../../models/Pipe';

@Component({
    templateUrl: './add-pipe-dialog.component.html',
    styleUrls: ['./add-pipe-dialog.component.scss']
})
export class AddPipeDialogComponent {
    appearance;
    godownTypes = [];
    form: FormGroup;
    stepIndex = 0;
    pipes: Pipe[];
    get pipesFormArray() {
        return this.form.get('pipes') as FormArray;
    }

    postUrl;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private data,
        private http: HttpClient,
        private tostr: ToastrService,
        private dialogRef: MatDialogRef<AddPipeDialogComponent>,
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.postUrl = this.config.getAbsoluteUrl('addPipe');
        this.godownTypes = data.godownTypes;
        this.pipes = data.pipes;
        this.form = this.fb.group({
            billNo: ['', Validators.required],
            godownType: '',
            remarks: '',
            pipes: this.fb.array([])
        })
        this.pipes.forEach(pipe => {
            console.log(pipe);
            this.pipesFormArray.push(this.buildPipeForm(pipe.count, pipe.pipe_size, pipe.pipe_type));
        })
        console.log(this.form);
    }

    savePipe() {
        const formValue = this.form.value;
        // this.pipes.forEach(pipe => {
        //     formValue[pipe.groupName].count === '' ? formValue[pipe.groupName].count = '0' : ''
        // })
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

    private buildPipeForm(start, size, type) {
        // console.log(start)
        return this.fb.group({ count: '', start, end: start, size, type })
    }
}