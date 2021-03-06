import { Component, Input, ElementRef, ViewChild, QueryList, ViewChildren, OnDestroy, AfterViewInit, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Bit } from '../../Bit';
import { Godown } from '../../../pipe/Godown';
import { ConfigService } from '../../../../services/config.service';
import { MatDatepicker, MatSelect, MatInput, MatDialog } from '@angular/material';
import { Subscription, Subject, zip, forkJoin, BehaviorSubject, Observable, timer, of } from 'rxjs';
import { OverlayCardService } from '../../../../services/overlay-card.service';
import { AddCompanyPopup } from './add-company-popup/add-company-popup.compoent';
import { CardOverlayref } from '../../../../services/card-overlay-ref';
import { debounceTime, distinctUntilChanged, map, switchMap, exhaustMap, delay, mergeMap } from 'rxjs/operators';
import { AddBitService } from '../add-bit.service';
import { Company } from '../../Company';
import { ToastrService } from 'ngx-toastr';
import { BitSize } from '../../BitSize';

@Component({
    selector: 'add-bit',
    templateUrl: './add-bit.component.html',
    styleUrls: ['./add-bit.component.scss']
})
export class AddBitComponent implements OnDestroy, AfterViewInit, OnInit {
    @Input() form: FormGroup;
    @Input() companies: Company[];
    @Input() bitSizes: BitSize[];
    @Input() notifyReset: Subject<void>;
    @Input() lastBitSerialNo;
    @ViewChild('picker', { static: false }) picker: MatDatepicker<any>;
    @ViewChild('dateInput', { static: false }) dateInput: ElementRef;
    @ViewChild('companySelect', { static: false }) companySelect: MatSelect;
    @ViewChild('bitSelect', { static: false }) bitSelect: MatSelect;
    @ViewChild('quantityInput', { static: false }) quantityInput: MatInput;
    companyPopupref: CardOverlayref;
    appearance;
    pickerClosedSubscription: Subscription;
    checkUniqueBillNoUrl;
    billNoValidationPending;
    quantityInput$ = new BehaviorSubject(null);
    infinite: Observable<any>;
    previousBillNo = '';
    notifyResetSubscription: Subscription;
    quantiyInputSubscription: Subscription;

    @ViewChildren('inputFocus') inputFocus: QueryList<ElementRef | MatInput>;
    @ViewChild('remarks', { static: false }) remarks: MatInput;
    getBitUrl;
    @ViewChild('addCompanyBtn', { static: false, read: ElementRef }) addCompanyBtn: ElementRef

    get bitFormArray() {
        return this.form.get('bits') as FormArray
    }

    constructor(
        private config: ConfigService,
        private cardOverlay: OverlayCardService,
        private addBitService: AddBitService,
        private toastr: ToastrService,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.infinite = this.quantityInput$.pipe(
            switchMap((value) => {
                if (value) {
                    return timer(300).pipe(mergeMap(() => of(value)))
                }
                return of(null);
            }),
            distinctUntilChanged(),
            map((value) => {
                // if (!value) return null;
                // const value = (event.target as HTMLInputElement).value;
                const ctrlCount = this.bitFormArray.controls.length;
                const count = value ? +value : 0;
                let serialNo = this.lastBitSerialNo || 0;

                if (count === ctrlCount) {
                    return;
                }
                if (count > ctrlCount) {
                    // add new control
                    let newCtrlCount = count - ctrlCount;
                    let lastCtrl = this.bitFormArray.at(this.bitFormArray.controls.length - 1);
                    if (lastCtrl) {
                        serialNo = lastCtrl.get('serialNo').value;
                    }
                    while (newCtrlCount) {
                        const bit = this.form.get('bit').value;
                        const company = this.form.get('company').value;
                        this.bitFormArray.push(this.addBitService.buildPipeForm(++serialNo, bit, company))
                        newCtrlCount--;
                    }
                }

                if (count < ctrlCount) {
                    // remove control

                    let removeCtrlCount = ctrlCount - count;

                    while (removeCtrlCount) {
                        this.bitFormArray.removeAt(this.bitFormArray.controls.length - 1);
                        removeCtrlCount--;
                    }
                }
                this.bitFormArray.controls = [...this.bitFormArray.controls];
                return this.bitFormArray.controls
            })
        )
    }


    ngOnInit() {




        this.notifyReset.subscribe(() => {
            this.quantityInput$.next(null);
            setTimeout(() => {
                (this.dateInput.nativeElement as HTMLInputElement).focus();
                this.picker.open()
            }, 500);
        })
    }

    goToFirstControl(event) {
        console.log('1');
        const value = (event.target as HTMLInputElement).value;
        const ctrlCount = this.bitFormArray.controls.length;
        const count = value ? +value : 0;
        setTimeout(() => {
            const firstCtrl = this.inputFocus.toArray()[0];
            if (firstCtrl) {
                if (firstCtrl instanceof MatInput) {
                    firstCtrl.focus();
                } else {
                    ((firstCtrl as ElementRef).nativeElement as HTMLInputElement).focus();
                }
            }
        }, 500)
    }

    ngOnDestroy() {
        if (this.companyPopupref) { this.companyPopupref.close(); }
        if (this.pickerClosedSubscription) { this.pickerClosedSubscription.unsubscribe(); }
        if (this.notifyResetSubscription) { this.notifyResetSubscription.unsubscribe(); }
        if (this.quantiyInputSubscription) { this.quantiyInputSubscription.unsubscribe(); }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            (this.dateInput.nativeElement as HTMLInputElement).focus();
            this.picker.open()
        }, 500);

        this.picker.closedStream.subscribe(() => {
            if (this.form.get('company').invalid) {
                this.companySelect.open();
                this.companySelect.focus();
            }
        })

    }

    onBitChange() {

        const selectedBit: BitSize = this.form.get('bit').value;
        this.bitFormArray.controls.forEach(ctrl => {
            ctrl.get('bit').setValue(selectedBit);
        });
        if (!this.form.get('quantity').value) {
            setTimeout(() => this.quantityInput.focus(), 200);
        }
        // this.addBitService.getLastBitSerial(selectedBit.size).subscribe((lastBitSerialNo) => {
        //     this.lastBitSerialNo = lastBitSerialNo;
        //     let serialNo = lastBitSerialNo;

        // }, () => { });


    }

    onCompanyChange() {
        if (this.form.get('bit').invalid) {
            setTimeout(() => {
                this.bitSelect.open();
                this.bitSelect.focus();
            }, 100);
        }
        const selectedCompany: Company = this.form.get('company').value;

        this.bitFormArray.controls.forEach(ctrl => {
            ctrl.get('company').setValue(selectedCompany);
        })
    }


    onEnter(event: KeyboardEvent) {

        const validKeys = ['Enter', 'ArrowDown', 'ArrowUp'];
        if (validKeys.indexOf(event.key) !== -1) {
            if (event.key === 'Enter' || event.key === 'ArrowDown') {
                // ctrl = this.inputFocus.toArray()[currentIndex + 1];
                setTimeout(() => {
                    const trigger = event.target as HTMLInputElement;
                    const currentRow = trigger.parentElement.parentElement;
                    let nextRow: HTMLElement = null;
                    let nextInput: HTMLInputElement = null
                    if (currentRow) {
                        nextRow = currentRow.nextElementSibling as HTMLElement;
                    }

                    if (nextRow) {
                        nextInput = nextRow.querySelector('.input-wrapper input')
                    }
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        if (this.remarks) {
                            this.remarks.focus()
                        }
                    }
                })
            }
            if (event.key === 'ArrowUp') {
                setTimeout(() => {
                    const trigger = event.target as HTMLInputElement;
                    const currentRow = trigger.parentElement.parentElement;
                    let prevRow: HTMLElement = null;
                    let prevInput: HTMLInputElement = null
                    if (currentRow) {
                        prevRow = currentRow.previousElementSibling as HTMLElement;
                    }

                    if (prevRow) {
                        prevInput = prevRow.querySelector('.input-wrapper input')
                    }
                    if (prevInput) {
                        prevInput.focus();
                    }
                })
            }
        }


    }


    addCompany() {
        if (this.companyPopupref) {
            this.companyPopupref.close()
        }
        this.companyPopupref = this.cardOverlay.open(AddCompanyPopup, this.addCompanyBtn, {}, [
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
                offsetX: -250,
                offsetY: -85
            }
        ]);
        this.companyPopupref.afterClosed$.subscribe((company: Company) => {
            if (company) {
                this.companies.push(company);
            }
        })
    }

    onBitInput($event) {
        this.quantityInput$.next($event.target.value);
    }


    enableQuantity() {
        if (this.disableQuantity()) {
            this.form.get('quantity').disable()
        } else {
            this.form.get('quantity').enable()
        }
    }
    showInfo() {
        console.log('click')
        if (this.form.get('date').invalid) {
            return this.toastr.error('Please enter date', null, { timeOut: 2000 });
        }

        if (this.form.get('bit').invalid) {
            return this.toastr.error('Please Select Bit', null, { timeOut: 2000 });
        }

        if (this.form.get('company').invalid) {
            return this.toastr.error('Please Select Company', null, { timeOut: 2000 });
        }
    }

    private disableQuantity() {
        return this.form.get('date').invalid || this.form.get('bit').invalid || this.form.get('company').invalid
    }
}