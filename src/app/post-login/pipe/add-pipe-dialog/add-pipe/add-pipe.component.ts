import { Component, Input, ElementRef, QueryList, ViewChildren, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatSelect, MatInput, MatDatepicker } from '@angular/material';
import { ConfigService } from '../../../../services/config.service';
import { Pipe } from '../../../../models/Pipe';
import { Subscription } from 'rxjs';

@Component({
    selector: 'add-pipe',
    templateUrl: './add-pipe.component.html',
    styleUrls: ['./add-pipe.component.scss']
})
export class AddPipeComponent implements AfterViewInit, OnDestroy {
    @Input() godownTypes;
    @Input() pipes: Pipe[];
    @Input() form: FormGroup;
    @Input() lastBillNo: number; // by default the value is 0 from parent component
    @ViewChild('picker', { static: false }) picker: MatDatepicker<any>;
    @ViewChild('dateInput', { static: false }) dateInput: ElementRef

    appearance;
    pickerClosedSubscription: Subscription;
    checkUniqueBillNoUrl;
    billNoValidationPending;
    previousBillNo = '';
    _inputElems: QueryList<ElementRef | MatSelect | MatInput>
    @ViewChildren('inputFocus') set inputElems(elems: QueryList<ElementRef | MatInput>) {
        setTimeout(() => {
            this._inputElems = elems;
        }, 100);
    }
    getPipeUrl;

    get pipeFormArray() {
        return this.form.get('pipes') as FormArray
    }

    constructor(
        private config: ConfigService,
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.getPipeUrl = this.config.getAbsoluteUrl('totalPipeCount');
        this.checkUniqueBillNoUrl = this.config.getAbsoluteUrl('billNoExists');

    }

    ngOnDestroy() {
        if (this.pickerClosedSubscription) { this.pickerClosedSubscription.unsubscribe() }
    }

    ngAfterViewInit() {
        this.pickerClosedSubscription = this.picker.closedStream.subscribe((res) => {
            let nextCtrl = this._inputElems.toArray()[1];
            if (nextCtrl) {
                ((nextCtrl as ElementRef).nativeElement as HTMLInputElement).focus();
            };
        })

    }

    // bill no should be greater than last entered bill no
    onBillNoChange() {
        const billNoCtrl = this.form.get('billNo');
        const billNo = billNoCtrl.value;
        // const godownTypeCtrl = this.form.get('godownType');
        console.log('change')
        if (billNoCtrl.hasError('required')) {
            billNoCtrl.markAllAsTouched();
            return;
        } else {
            if (billNo <= this.lastBillNo) {
                billNoCtrl.markAllAsTouched();
                billNoCtrl.setErrors({ lesserBillNo: true });
                // (this._inputElems.toArray()[0] as MatInput).focus();
            } else {

                if (this.picker) {
                    (this.dateInput.nativeElement as HTMLInputElement).focus();
                    this.picker.open();
                }
                return;
            }
        }

    }

    onBillEnter() {
        // either enter key up or change will be called, both are not called same time
        this.onBillNoChange();
    }

    onEnter(event: KeyboardEvent, currentIndex) {
        const nextCtrl = this._inputElems.toArray()[currentIndex + 1];
        if (nextCtrl) {
            if (nextCtrl instanceof MatInput) {
                return setTimeout(() => {
                    nextCtrl.focus();
                }, 100)
                 
            }
            if (nextCtrl instanceof ElementRef) {
                (nextCtrl.nativeElement as HTMLInputElement).focus();
            }
        }
    }

    calcPipeAdded(pipeCtrl: FormGroup) {
        let start: any = this.pipes.find(pipe => pipe.pipe_size === pipeCtrl.get('size').value).count;
        start = start ? +start : 0;
        let intialStart = start;
        const count = pipeCtrl.get('count').value ? +pipeCtrl.get('count').value : 0;
        if (count <= 0) {
            // do nothing
        } else {
            start += 1;
        }
        const end = intialStart + count;
        pipeCtrl.get('start').setValue(start.toString());
        pipeCtrl.get('end').setValue(end.toString())
    }

    pipeAddedDisplay(pipeCtrl: FormGroup) {
        let start = pipeCtrl.get('start').value ? +pipeCtrl.get('start').value : 0;
        const end = pipeCtrl.get('end').value ? +pipeCtrl.get('end').value : 0;
        if (start === end) {
            return start;
        }
        return `(${start} - ${end})`;
    }
}