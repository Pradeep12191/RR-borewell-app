import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Bit } from '../Bit';
import { BitBill } from './LastBitBill';
import { Godown } from '../../pipe/Godown';
import { Moment } from 'moment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './add-bit-dialog.component.html',
    styleUrls: ['./add-bit-dialog.component.scss']
})
export class AddBitDialogComponent {
    form: FormGroup;
    bits: BitBill[];
    lastBillNo;
    selectedGodown: Godown;
    stepIndex = 0;
    postUrl

    get bitssFormArray() {
        return this.form.get('bits') as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data,
        private http: HttpClient,
        private config: ConfigService,
        private dialogRef: MatDialogRef<AddBitDialogComponent>,
        private toastr: ToastrService
    ) {
        this.bits = data.lastBill;
        this.selectedGodown = data.selectedGodown;
        if (this.bits && this.bits.length) {
            this.lastBillNo = +this.bits[0].bill_no;
        }
        this.postUrl = this.config.getAbsoluteUrl('addBit');
        this.form = this.fb.group({
            billNo: ['', Validators.required],
            remarks: '',
            date: '',
            company: '',
            bits: this.fb.array([])
        });

        this.bits.forEach(bit => {
            console.log(bit);
            this.bitssFormArray.push(this.buildPipeForm(bit.count, bit.size, bit.type));
        })
    }

    saveBit() {
        const formValue = this.form.value;
        // this.pipes.forEach(pipe => {
        //     formValue[pipe.groupName].count === '' ? formValue[pipe.groupName].count = '0' : ''
        // })
        formValue.bits.forEach(bit => {
            bit.count === '' ? bit.count = '0' : ''
        })
        const date = formValue.date ? (formValue.date as Moment).format('DD-MM-YYYY') : null;

        console.log(JSON.stringify({...formValue, godownType: this.selectedGodown, date }, null, 2));
        this.http.post(this.postUrl, {...formValue, godownType: this.selectedGodown }).subscribe((response) => {
            this.toastr.success('Bit Information added successfully', null, { timeOut: 2000 });
            this.dialogRef.close(response);
        }, (err) => {
            if (err) {
                this.toastr.error('Error while saving Bit Information', null, { timeOut: 1500 });
            }
        })
    }


    private buildPipeForm(start, size, type) {
        // console.log(start)
        return this.fb.group({ count: '', start, end: start, size, type })
    }
}