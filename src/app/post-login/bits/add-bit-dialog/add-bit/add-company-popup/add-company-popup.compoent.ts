import { Component, OnInit } from '@angular/core';
import { SCALE_UP_ANIMATION } from '../../../../../animations/scale-up.animaion';
import { ConfigService } from '../../../../../services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CardOverlayref } from '../../../../../services/card-overlay-ref';

@Component({
    templateUrl: './add-company-popup.component.html',
    styleUrls: ['./add-company-popup.component.scss'],
    animations: [SCALE_UP_ANIMATION]
})
export class AddCompanyPopup implements OnInit {
    appearance;
    form: FormGroup;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        private overlayRef: CardOverlayref
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ''
        })
    }

    close() {
        this.overlayRef.close()
    }
}