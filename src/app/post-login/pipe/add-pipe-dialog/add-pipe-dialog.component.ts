import { Component } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './add-pipe-dialog.component.html',
    styleUrls: ['./add-pipe-dialog.component.scss']
})
export class AddPipeDialogComponent {
    appearance;
    godownTypes = ['MM', 'RR'];
    form: FormGroup;
    pipes = [
        { type: '11\'\'Inch 4Kg', groupName: '11Inch4Kg' },
        { type: '8\'\'Inch 4Kg', groupName: '8Inch4Kg' },
        { type: '7\'\'Inch 8Kg', groupName: '7Inch8Kg' },
        { type: '7\'\'Inch 6Kg', groupName: '7Inch6Kg' },
        { type: '5\'\'Inch 8Kg', groupName: '5Inch8Kg' },
        { type: '5\'\'Inch 6Kg', groupName: '5Inch6Kg' },
        { type: '4\'\'Inch 6Kg', groupName: '4Inch6Kg' },
        { type: '4\'\'Inch 4Kg', groupName: '4Inch4Kg' }
    ]
    constructor(
        private config: ConfigService,
        private fb: FormBuilder
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.form = this.fb.group({
            billNo: '',
            godownType: '',
            remarks: ''
        })
        this.pipes.forEach(pipe => {
            this.form.addControl(pipe.groupName, this.buildPipeForm())
        })
    }

    savePipe() {
        console.log( JSON.stringify(this.form.value, null, 2));
    }

    private buildPipeForm() {
        return this.fb.group({ count: '', start: '', end: '' })
    }
}