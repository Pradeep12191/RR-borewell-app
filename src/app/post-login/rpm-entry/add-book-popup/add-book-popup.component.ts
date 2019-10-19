import { Component, ViewChild, ElementRef, AfterViewInit, Inject, OnInit, OnDestroy } from '@angular/core';
import { SCALE_UP_ANIMATION } from '../../../animations/scale-up.animaion';
import { CardOverlayref } from '../../../services/card-overlay-ref';
import { ConfigService } from '../../../services/config.service';
import { RpmEntryService } from '../rpm-entry.service';
import { OVERLAY_CARD_DATA } from '../../../services/overlay-card.service';
import { Vehicle } from '../../../models/Vehicle';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

function compareValidator(control: AbstractControl) {
    const start = +control.get('start').value;
    const end = +control.get('end').value;
    if (end <= start) {
        return { invalidPage: true }
    }
    return null;

}

@Component({
    templateUrl: './add-book-popup.component.html',
    styleUrls: ['./add-book-popup.component.scss'],
    animations: [SCALE_UP_ANIMATION]
})
export class AddBookPopupComponent implements AfterViewInit, OnInit, OnDestroy {
    appearance;
    bookCount;
    startPageNo;
    endPageNo;
    isSubmitAttempt;
    bookForm: FormGroup;
    vehicle: Vehicle;
    bookRequired: boolean;
    valueChangesSubscription: Subscription;

    @ViewChild('bookInp', { static: false, read: ElementRef }) bookInput: ElementRef
    @ViewChild('bookStart', { static: false, read: ElementRef }) bookStart: ElementRef
    @ViewChild('bookEnd', { static: false, read: ElementRef }) bookEnd: ElementRef
    constructor(
        private overlayRef: CardOverlayref,
        private config: ConfigService,
        private rpmEntryService: RpmEntryService,
        private fb: FormBuilder,
        @Inject(OVERLAY_CARD_DATA) data
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        console.log(data);
        this.vehicle = data.vehicle;
        this.bookRequired = data.isRequired;
    }

    ngOnInit() {
        this.bookForm = this.fb.group({
            start: ['', [Validators.required]],
            end: ['', Validators.required]
        }, { validators: compareValidator });

        this.valueChangesSubscription = this.bookForm.valueChanges.subscribe(() => {
            // this.bookRequired = false;
        });
    }
    ngOnDestroy() {
        if (this.valueChangesSubscription) {
            this.valueChangesSubscription.unsubscribe();
        }
    }

    saveBook() {
        this.isSubmitAttempt = true;
        if (this.bookForm.invalid) {
            return;
        }



        this.rpmEntryService.postBook({
            vehicle_id: +this.vehicle.vehicle_id,
            vehicle_no: this.vehicle.regNo,
            start: +this.bookForm.value.start,
            end: +this.bookForm.value.end
        }).subscribe((book) => {
            this.overlayRef.close(book);
        }, (err) => {

        })

    }

    cancel() {
        this.overlayRef.close();
    }

    getErrorMessage() {
        if (this.isSubmitAttempt) {
            if (this.bookForm.invalid && this.bookForm.dirty) {
                const end = this.bookForm.get('end');
                const start = this.bookForm.get('start');
                if (end.hasError('required')) {
                    return 'End Page no is required';
                }
                if (start.hasError('required')) {
                    return 'Start Page no is required';
                }
                if (this.bookForm.hasError('invalidPage')) {
                    return 'End page No should be greater than Start Page No';
                }
            }
        }
    }

    onStartEnter() {
        // jumb to end page no
        setTimeout(() => {
            (this.bookEnd.nativeElement as HTMLInputElement).focus()
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            (this.bookStart.nativeElement as HTMLInputElement).focus()
        })
    }
}