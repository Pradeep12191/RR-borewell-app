import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SCALE_UP_ANIMATION } from '../../../../../animations/scale-up.animaion';
import { ConfigService } from '../../../../../services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardOverlayref } from '../../../../../services/card-overlay-ref';
import { AddBitService } from '../../add-bit.service';
import { MatInput } from '@angular/material';

@Component({
    templateUrl: './add-company-popup.component.html',
    styleUrls: ['./add-company-popup.component.scss'],
    animations: [SCALE_UP_ANIMATION]
})
export class AddCompanyPopup implements OnInit, AfterViewInit {
    appearance;
    form: FormGroup;
    @ViewChild('nameInput', { static: false }) nameInput: MatInput;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        private overlayRef: CardOverlayref,
        private addBitService: AddBitService,
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required]
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.nameInput.focus();
        }, 100)
        
    }

    save() {
        this.addBitService.addBitCompany(this.form.value).subscribe((company) => {
            this.overlayRef.close(company)
        })
    }

    close() {
        this.overlayRef.close()
    }
}