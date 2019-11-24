import { Component, Inject, ViewChild, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { Godown } from '../../pipe/Godown';
import { Moment } from 'moment';
import { ConfigService } from '../../../services/config.service';
import { LoaderService } from '../../../services/loader-service';
import { finalize, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, noop } from 'rxjs';
import { HammerSize } from '../hammer-size.model';
import { HammersService } from '../hammers.service';
import { Company } from '../../bits/Company';
import { AppState } from '../../../store/reducer';
import { Store } from '@ngrx/store';
import { HammerActions } from '../store/actions-types';
import { Actions, ofType } from '@ngrx/effects';

@Component({
    templateUrl: './add-hammer-dialog.component.html',
    styleUrls: ['./add-hammer-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddHammerDialogComponent implements OnInit, OnDestroy {
    form: FormGroup;
    hammerSizes: HammerSize[];
    selectedGodown: Godown;
    stepIndex = 0;
    postUrl;
    companies: Company[];
    notifyReset = new Subject();
    serialNos = [];
    actionsSubscription: Subscription;
    @ViewChild(MatStepper, { static: false }) stepper: MatStepper;


    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) data,
        private store: Store<AppState>,
        private dialogRef: MatDialogRef<AddHammerDialogComponent>,
        private loader: LoaderService,
        private actions$: Actions,
        private toastr: ToastrService
    ) {
        this.selectedGodown = data.selectedGodown;
        this.form = this.fb.group({
            date: ['', Validators.required],
            company: ['', Validators.required],
            hammer: ['', Validators.required],
            quantity: [{ value: '', disabled: true }, Validators.required],
            bits: this.fb.array([]),
            remarks: ''
        });
    }

    ngOnInit() {
        this.actionsSubscription = this.actions$.pipe(
            ofType(HammerActions.updateLastHammerSerial, HammerActions.closeDialog),
            tap((action) => {
                if (action.type === HammerActions.updateLastHammerSerial.type) {
                    this.toastr.success('Hammers added sucessfully');
                    this.stepper.reset();
                    this.notifyReset.next();
                }
                if (action.type === HammerActions.closeDialog.type) {
                    this.loader.hideSaveLoader()
                    this.dialogRef.close();
                }
            })
        ).subscribe(noop)
    }

    ngOnDestroy() {
        if (this.actionsSubscription) { this.actionsSubscription.unsubscribe() }
    }

    onQuantityChange(serialNos) {
        this.serialNos = serialNos;
    }

    saveBit() {


        const payload = {
            quantity: +this.form.value.quantity,
            remarks: this.form.value.remarks,
            date: (this.form.value.date as Moment).format('DD-MM-YYYY'),
            company_id: this.form.value.company.id,
            company_name: this.form.value.company.name,
            bit_size: this.form.value.hammer.size,
            bit_type: this.form.value.hammer.type,
            bit_id: this.form.value.hammer.id,
            godown_id: this.selectedGodown.godown_id,
            k_assign_bits: []
        }

        this.serialNos.forEach(h => {
            const hammer = {
                serial_no: h.serialNo,
                no: h.bitNo ? +h.bitNo : 0,
                size: h.hammer.size,
                type: h.hammer.type,
                id: h.hammer.id,
                company_id: this.form.value.company.id,
                company_name: this.form.value.company.name,
                date: (this.form.value.date as Moment).format('DD-MM-YYYY')
            }
            payload.k_assign_bits.push(hammer);
        });

        console.log(JSON.stringify(payload, null, 2));
        this.store.dispatch(HammerActions.postHammers({ hammers: payload }));
    }

    updateAndClose() {
        this.loader.showSaveLoader('Loading')
        this.store.dispatch(HammerActions.loadAllHammers({ godown_id: this.selectedGodown.godown_id }));
    }



}