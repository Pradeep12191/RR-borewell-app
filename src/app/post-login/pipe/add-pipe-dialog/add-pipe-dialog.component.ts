import { Component, Inject } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: './add-pipe-dialog.component.html',
    styleUrls: ['./add-pipe-dialog.component.scss']
})
export class AddPipeDialogComponent {
    appearance;
    godownTypes = ['MM', 'RR'];
    form: FormGroup;
    pipes = [
        { type: '4\'\'Inch 4Kg', groupName: 'p_4Inch4Kg', key: 'p_4Inch4Kg1', count: '' },
        { type: '4\'\'Inch 6Kg', groupName: 'p_4Inch6Kg', key: 'p_4Inch6Kg1', count: '' },
        { type: '5\'\'Inch 6Kg', groupName: 'p_5Inch6Kg', key: 'p_5Inch6Kg1', count: '' },
        { type: '5\'\'Inch 8Kg', groupName: 'p_5Inch8Kg', key: 'p_5Inch8Kg1', count: '' },
        { type: '7\'\'Inch 6Kg', groupName: 'p_7Inch6Kg', key: 'p_7Inch6Kg1', count: '' },
        { type: '7\'\'Inch 8Kg', groupName: 'p_7Inch8Kg', key: 'p_7Inch8Kg1', count: '' },
        { type: '8\'\'Inch 4Kg', groupName: 'p_8Inch4Kg', key: 'p_8Inch4Kg1', count: '' },
        { type: '11\'\'Inch 4Kg', groupName: 'p_11Inch4Kg', key: 'p_11Inch4Kg1', count: '' },
    ]
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.godownTypes = data.godownTypes;
        const pipes = data.pipes;
        console.log(pipes);
        this.pipes.forEach(pipe => {
            pipe.count = pipes.find(pipeData => pipeData.key === pipe.key).count;
        })
        this.form = this.fb.group({
            billNo: '',
            godownType: '',
            remarks: ''
        })
        this.pipes.forEach(pipe => {
            this.form.addControl(pipe.groupName, this.buildPipeForm(pipe.count))
        })
    }

    savePipe() {
        console.log(JSON.stringify(this.form.value, null, 2));
    }

    caclPipeAdded(pipeCtrl: FormGroup, grpName) {
        let start: any = this.pipes.find(pipe => pipe.groupName === grpName).count;
        start = start ? +start : 0;
        let intialStart = start;
        const count = pipeCtrl.get('count').value ? +pipeCtrl.get('count').value : 0;
        if (count <= 0) {
            // do nothing
        } else {
            start += 1;
        }
        const end = intialStart + count;
        pipeCtrl.get('start').setValue(start.toString());
        pipeCtrl.get('end').setValue(end.toString())
    }

    pipeAddedDisplay(pipeCtrl: FormGroup) {
        let start = pipeCtrl.get('start').value ? +pipeCtrl.get('start').value : 0;
        const end = pipeCtrl.get('end').value ? +pipeCtrl.get('end').value : 0;
        if (start === end) {
            return start;
        }
        return `(${start} - ${end})`;
    }

    private buildPipeForm(start) {
        console.log(start)
        return this.fb.group({ count: '', start, end: start })
    }
}