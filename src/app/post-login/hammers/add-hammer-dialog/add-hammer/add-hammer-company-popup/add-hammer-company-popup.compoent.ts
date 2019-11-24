import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SCALE_UP_ANIMATION } from '../../../../../animations/scale-up.animaion';
import { ConfigService } from '../../../../../services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardOverlayref } from '../../../../../services/card-overlay-ref';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/reducer';
import { HammerActions } from '../../../store/actions-types';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription, noop } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    templateUrl: './add-hammer-company-popup.component.html',
    styleUrls: ['./add-hammer-company-popup.component.scss'],
    animations: [SCALE_UP_ANIMATION]
})
export class AddHammerCompanyPopup implements OnInit {
    appearance;
    form: FormGroup;
    actionsSubscription: Subscription;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        private overlayRef: CardOverlayref,
        private store: Store<AppState>,
        private actions$: Actions,
        private toastr: ToastrService
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required]
        });

        this.actionsSubscription = this.actions$.pipe(
            ofType(HammerActions.addCompany, HammerActions.errorAddingCompany),
            tap((action) => {
                if (action.type === HammerActions.addCompany.type) {
                    this.toastr.success('Company Added Successfully');
                    this.overlayRef.close();
                } else { 
                    this.toastr.error('Error While adding company');
                    this.overlayRef.close();
                }

            })
        ).subscribe(noop);
    }



    save() {
        this.store.dispatch(HammerActions.postCompany({ company: this.form.value }));
    }

    close() {
        this.overlayRef.close()
    }
}