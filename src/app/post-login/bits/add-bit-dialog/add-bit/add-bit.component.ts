import { Component, Input, ElementRef, ViewChild, QueryList, ViewChildren, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Bit } from '../../Bit';
import { Godown } from '../../../pipe/Godown';
import { ConfigService } from '../../../../services/config.service';
import { MatDatepicker, MatSelect, MatInput, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { OverlayCardService } from '../../../../services/overlay-card.service';
import { AddCompanyPopup } from './add-company-popup/add-company-popup.compoent';
import { CardOverlayref } from '../../../../services/card-overlay-ref';

@Component({
    selector: 'add-bit',
    templateUrl: './add-bit.component.html',
    styleUrls: ['./add-bit.component.scss']
})
export class AddBitComponent implements OnDestroy, AfterViewInit {
    @Input() form: FormGroup;
    @Input() lastBillNo;
    @Input() bits: Bit[];
    @ViewChild('picker', { static: false }) picker: MatDatepicker<any>;
    @ViewChild('dateInput', { static: false }) dateInput: ElementRef;
    companyPopupref: CardOverlayref;

    appearance;
    pickerClosedSubscription: Subscription;
    checkUniqueBillNoUrl;
    billNoValidationPending;
    previousBillNo = '';
    _inputElems: QueryList<ElementRef | MatSelect | MatInput>;
    companies;
    @ViewChildren('inputFocus') set inputElems(elems: QueryList<ElementRef | MatInput>) {
        setTimeout(() => {
            this._inputElems = elems;
        }, 100);
    }
    getBitUrl;
    @ViewChild('addCompanyBtn', { static: false, read: ElementRef }) addCompanyBtn: ElementRef

    get bitFormArray() {
        return this.form.get('bits') as FormArray
    }

    constructor(
        private config: ConfigService,
        private cardOverlay: OverlayCardService,
        private dialog: MatDialog
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnDestroy() {
        if (this.companyPopupref) { this.companyPopupref.close() }
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

    calcBitAdded(bitCtrl: FormGroup) {
        let start: any = this.bits.find(pipe => pipe.size === bitCtrl.get('size').value).count;
        start = start ? +start : 0;
        let intialStart = start;
        const count = bitCtrl.get('count').value ? +bitCtrl.get('count').value : 0;
        if (count <= 0) {
            // do nothing
        } else {
            start += 1;
        }
        const end = intialStart + count;
        bitCtrl.get('start').setValue(start.toString());
        bitCtrl.get('end').setValue(end.toString())
    }

    bitAddedDisplay(bitCtrl) {
        let start = bitCtrl.get('start').value ? +bitCtrl.get('start').value : 0;
        const end = bitCtrl.get('end').value ? +bitCtrl.get('end').value : 0;
        if (start === end) {
            return start;
        }
        return `(${start} - ${end})`;
    }

    addCompany() {
        if (this.companyPopupref) {
            this.companyPopupref.close()
        }
        this.companyPopupref = this.cardOverlay.open(AddCompanyPopup, this.addCompanyBtn, {}, []);
    }
}