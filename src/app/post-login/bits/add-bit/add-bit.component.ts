import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './add-bit.component.html',
    styleUrls: ['./add-bit.component.scss']
})
export class AddBitComponent implements OnInit {
    form: FormGroup;
    appearance;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder
    ) {
        this.appearance = this.config.getConfig('formAppearance');
    }

    ngOnInit() {
        this.form = this.fb.group({
            billNo: ''
        })
    }
}