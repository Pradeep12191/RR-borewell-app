import { Component, Input, ElementRef, ViewChild, QueryList, ViewChildren, OnDestroy, AfterViewInit, OnInit, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigService } from '../../../../services/config.service';
import { MatDatepicker, MatSelect, MatInput } from '@angular/material';
import { Subscription, Subject, Observable } from 'rxjs';
import { OverlayCardService } from '../../../../services/overlay-card.service';
import { AddHammerCompanyPopup } from './add-hammer-company-popup/add-hammer-company-popup.compoent';
import { CardOverlayref } from '../../../../services/card-overlay-ref';
import { shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Company } from '../../../bits/Company';
import { HammerSize } from '../../hammer-size.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/reducer';
import { selectCompanies, selectLastHammerSerialNo, selectAllHammers } from '../../store/selectors';

export interface HammerSerial { serialNo: number, company: Company; hammer: HammerSize }

@Component({
    selector: 'add-hammer',
    templateUrl: './add-hammer.component.html',
    styleUrls: ['./add-hammer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddHammerComponent implements OnDestroy, AfterViewInit, OnInit {
    @Input() form: FormGroup;
    @Input() notifyReset: Subject<void>;
    @Output() quantityChange = new EventEmitter();
    @ViewChild('picker', { static: false }) picker: MatDatepicker<any>;
    @ViewChild('dateInput', { static: false }) dateInput: ElementRef;
    @ViewChild('companySelect', { static: false }) companySelect: MatSelect;
    @ViewChild('hammerSelect', { static: false }) hammerSelect: MatSelect;
    @ViewChild('quantityInput', { static: false }) quantityInput: MatInput;
    companyPopupref: CardOverlayref;
    appearance;
    pickerClosedSubscription: Subscription;
    checkUniqueBillNoUrl;
    billNoValidationPending;
    infinite: Observable<any>;
    previousBillNo = '';
    notifyResetSubscription: Subscription;
    companies$: Observable<Company[]>;
    lastHammerSerialNo$: Observable<number>;
    hammers$: Observable<HammerSize[]>;
    hammerSerialNos: HammerSerial[] = [];
    lastSerialNo = 0;
    @ViewChildren('inputFocus') inputFocus: QueryList<ElementRef | MatInput>;
    @ViewChild('remarks', { static: false }) remarks: MatInput;
    @ViewChild('addCompanyBtn', { static: false, read: ElementRef }) addCompanyBtn: ElementRef

    constructor(
        private config: ConfigService,
        private cardOverlay: OverlayCardService,
        private toastr: ToastrService,
        private store: Store<AppState>,
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }


    ngOnInit() {
        this.companies$ = this.store.pipe(select(selectCompanies));
        this.lastHammerSerialNo$ = this.store.pipe(select(selectLastHammerSerialNo), shareReplay());
        this.hammers$ = this.store.pipe(select(selectAllHammers));
        this.lastHammerSerialNo$.subscribe((lastSerialNo) => this.lastSerialNo = lastSerialNo);

        this.notifyReset.subscribe(() => {
            this.hammerSerialNos = [];
            setTimeout(() => {
                (this.dateInput.nativeElement as HTMLInputElement).focus();
                this.picker.open()
            }, 500);
        })
    }


    ngOnDestroy() {
        if (this.companyPopupref) { this.companyPopupref.close(); }
        if (this.pickerClosedSubscription) { this.pickerClosedSubscription.unsubscribe(); }
        if (this.notifyResetSubscription) { this.notifyResetSubscription.unsubscribe(); }
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

    onHammerChange() {

        const selectedHammer: HammerSize = this.form.get('hammer').value;
        this.hammerSerialNos.forEach(s => s.hammer = selectedHammer)
        if (!this.form.get('quantity').value) {
            setTimeout(() => this.quantityInput.focus(), 200);
        }

    }

    onCompanyChange() {
        if (this.form.get('hammer').invalid) {
            setTimeout(() => {
                this.hammerSelect.open();
                this.hammerSelect.focus();
            }, 100);
        }
        const selectedCompany: Company = this.form.get('company').value;

        this.hammerSerialNos.forEach(s => s.company = selectedCompany)
    }


    addCompany() {
        if (this.companyPopupref) {
            this.companyPopupref.close()
        }
        this.companyPopupref = this.cardOverlay.open(AddHammerCompanyPopup, this.addCompanyBtn, {}, [
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
                offsetX: -250,
                offsetY: -85
            }
        ]);
    }

    onHammerInput($event) {
        // this.hammer
        const count = +$event.target.value;
        const existingCount = this.hammerSerialNos.length;
        const arr: HammerSerial[] = [];
        if (count === existingCount) {
            return
        }

        for (let i = 1; i <= count; i++) {
            const hammer: HammerSize = this.form.get('hammer').value;
            const company = this.form.get('company').value;
            arr.push({ company, hammer, serialNo: i + this.lastSerialNo })
        }

        this.hammerSerialNos = [...arr];
        this.quantityChange.emit(this.hammerSerialNos);
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

        if (this.form.get('hammer').invalid) {
            return this.toastr.error('Please Select Hammer', null, { timeOut: 2000 });
        }

        if (this.form.get('company').invalid) {
            return this.toastr.error('Please Select Company', null, { timeOut: 2000 });
        }
    }

    private disableQuantity() {
        return this.form.get('date').invalid || this.form.get('hammer').invalid || this.form.get('company').invalid
    }
}