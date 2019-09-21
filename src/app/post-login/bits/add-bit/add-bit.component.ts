import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
    templateUrl: './add-bit.component.html',
    styleUrls: ['./add-bit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddBitComponent implements OnInit {
    form: FormGroup;
    appearance;
    lastBillNo;

    get serialNosFormArray() {
        return this.form.get('serialNos') as FormArray;
    }

    constructor(
        private config: ConfigService,
        private fb: FormBuilder
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnInit() {
        this.form = this.fb.group({
            billNo: '',
            serialNos: this.fb.array([])
        })

        const serialNos = Array.from({ length: 250 }).forEach((_, i) => {
            this.serialNosFormArray.push(this.buildBitSerialNoForm(i));
        })
    }

    addPipe() {
        console.log(this.form.value.serialNos)
    }

    godownChange(){

    }


    private buildBitSerialNoForm(serialNo) {
        return this.fb.group({ serialNo, bitNo: '', bitSize: '' })
    }
}