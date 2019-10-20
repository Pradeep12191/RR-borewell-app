import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OVERLAY_CARD_DATA } from '../../../services/overlay-card.service';
import { SCALE_UP_ANIMATION } from '../../../animations/scale-up.animaion';
import { ConfigService } from '../../../services/config.service';
import { CardOverlayref } from '../../../services/card-overlay-ref';

@Component({
    templateUrl: './add-diesel-popup.component.html',
    styleUrls: ['./add-diesel-popup.component.scss'],
    animations: [SCALE_UP_ANIMATION]
})

export class AddDieselPopupComponent implements AfterViewInit {
    dieselForm: FormGroup;
    liter;
    appearance;
    @ViewChild('literInput', { static: false, read: ElementRef }) literInput: ElementRef;

    constructor(
        private config: ConfigService,
        @Inject(OVERLAY_CARD_DATA) data,
        private overlayRef: CardOverlayref,
        private fb: FormBuilder
    ) {
        this.liter = data;
        this.appearance = this.config.getConfig('formAppearance')
        this.dieselForm = this.fb.group({
            liter: ['', Validators.required]
        })
    };

    ngAfterViewInit() {
        setTimeout(() => {
            (this.literInput.nativeElement as HTMLInputElement).focus()
        });
    }

    updateDiesel() {
        this.overlayRef.close(this.dieselForm.value.liter);
    }

    cancel() {
        this.overlayRef.close()
    }
}