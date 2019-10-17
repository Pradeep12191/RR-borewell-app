import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { Godown } from '../../pipe/Godown';
import { Moment } from 'moment';
import { ConfigService } from '../../../services/config.service';
import { Company } from '../Company';
import { BitSize } from '../BitSize';
import { AddBitService } from './add-bit.service';
import { LoaderService } from '../../../services/loader-service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './add-bit-dialog.component.html',
    styleUrls: ['./add-bit-dialog.component.scss']
})
export class AddBitDialogComponent {
    form: FormGroup;
    bitSizes: BitSize[];
    selectedGodown: Godown;
    stepIndex = 0;
    postUrl;
    companies: Company[];
    notifyReset = new Subject()
    @ViewChild(MatStepper, { static: false }) stepper: MatStepper;

    get bitssFormArray() {
        return this.form.get('bits') as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data,
        private config: ConfigService,
        private addBitService: AddBitService,
        private dialogRef: MatDialogRef<AddBitDialogComponent>,
        private loader: LoaderService,
        private toastr: ToastrService
    ) {
        this.bitSizes = data.bitSizes;
        this.selectedGodown = data.selectedGodown;
        this.companies = data.companies;
        this.postUrl = this.config.getAbsoluteUrl('addBit');
        this.form = this.fb.group({
            date: ['', Validators.required],
            company: ['', Validators.required],
            bit: ['', Validators.required],
            quantity: [{ value: '', disabled: true }, Validators.required],
            bits: this.fb.array([]),
            remarks: ''
        });
    }

    saveBit() {


        const payload = {
            quantity: +this.form.value.quantity,
            remarks: this.form.value.remarks,
            date: (this.form.value.date as Moment).format('DD-MM-YYYY'),
            company_id: this.form.value.company.id,
            company_name: this.form.value.company.name,
            bit_size: this.form.value.bit.size,
            bit_type: this.form.value.bit.type,
            bit_id: this.form.value.bit.id,
            godown_id: this.selectedGodown.godown_id,
            k_assign_bits: []
        }

        this.form.value.bits.forEach(b => {
            const bit = {
                serial_no: b.serialNo,
                no: b.bitNo ? +b.bitNo : 0,
                size: b.bit.size,
                type: b.bit.type,
                id: b.bit.id,
                company_id: this.form.value.company.id,
                company_name: this.form.value.company.name,
                date: (this.form.value.date as Moment).format('DD-MM-YYYY')
            }
            payload.k_assign_bits.push(bit);
        });

        console.log(JSON.stringify(payload, null, 2));
        this.addBitService.addBit(payload).subscribe((res) => {
            this.toastr.success('Bit added successfully');
            this.dialogRef.close(res)
            // while (this.bitssFormArray.length) {
            //     this.bitssFormArray.removeAt(this.bitssFormArray.length - 1);
            // }
            // this.stepper.reset();
            // this.notifyReset.next();
        }, () => { });
    }

    updateAndClose() {
        this.loader.showSaveLoader('Loading')
        this.addBitService.getBitsCount(this.selectedGodown.godown_id)
            .pipe(finalize(() => this.loader.hideSaveLoader()))
            .subscribe((bits) => {
                this.dialogRef.close(bits)
            }, (err) => {
                if (err) {
                    this.toastr.error('Error while fetching bit count', null, { timeOut: 2000 })
                }
                this.dialogRef.close()
            })
    }



}