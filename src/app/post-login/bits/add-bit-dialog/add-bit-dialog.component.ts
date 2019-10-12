import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Godown } from '../../pipe/Godown';
import { Moment } from 'moment';
import { ConfigService } from '../../../services/config.service';
import { Company } from '../Company';
import { BitSize } from '../BitSize';
import { AddBitService } from './add-bit.service';

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

    get bitssFormArray() {
        return this.form.get('bits') as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data,
        private config: ConfigService,
        private addBitService: AddBitService
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
        this.addBitService.addBit(payload).subscribe(() => { }, () => { });
    }



}