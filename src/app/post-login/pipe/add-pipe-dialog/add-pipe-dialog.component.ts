import { Component, Inject, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup, FormControl, NgControl, FormControlName } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelect, MatSelectChange, MatInput } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader-service';

@Component({
    templateUrl: './add-pipe-dialog.component.html',
    styleUrls: ['./add-pipe-dialog.component.scss']
})
export class AddPipeDialogComponent {
    appearance;
    godownTypes = [];
    form: FormGroup;
    selectedGodown;
    _inputElems: QueryList<ElementRef | MatSelect | MatInput>
    @ViewChildren('inputFocus') set inputElems(elems: QueryList<ElementRef | MatSelect | MatInput>) {
        setTimeout(() => {
            this._inputElems = elems;
        });
    }
    pipes = [
        { type: '4\'\'Inch 4Kg', groupName: 'p_4Inch4Kg', key: 'p_4Inch4Kg1', count: '0' },
        { type: '4\'\'Inch 6Kg', groupName: 'p_4Inch6Kg', key: 'p_4Inch6Kg1', count: '0' },
        { type: '5\'\'Inch 6Kg', groupName: 'p_5Inch6Kg', key: 'p_5Inch6Kg1', count: '0' },
        { type: '5\'\'Inch 8Kg', groupName: 'p_5Inch8Kg', key: 'p_5Inch8Kg1', count: '0' },
        { type: '7\'\'Inch 6Kg', groupName: 'p_7Inch6Kg', key: 'p_7Inch6Kg1', count: '0' },
        { type: '7\'\'Inch 8Kg', groupName: 'p_7Inch8Kg', key: 'p_7Inch8Kg1', count: '0' },
        { type: '8\'\'Inch 4Kg', groupName: 'p_8Inch4Kg', key: 'p_8Inch4Kg1', count: '0' },
        { type: '11\'\'Inch 4Kg', groupName: 'p_11Inch4Kg', key: 'p_11Inch4Kg1', count: '0' },
    ]
    postUrl;
    getPipeUrl;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private data,
        private http: HttpClient,
        private tostr: ToastrService,
        private dialogRef: MatDialogRef<AddPipeDialogComponent>,
        private auth: AuthService,
        private loader: LoaderService
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.postUrl = this.config.getAbsoluteUrl('addPipe');
        this.getPipeUrl = this.config.getAbsoluteUrl('pipeCount') + '/' + this.auth.userid;
        this.godownTypes = data.godownTypes;
        this.selectedGodown = this.godownTypes.find(godown => godown.godown_id === data.selectedGodownId);
        const pipes = data.pipes;
        // console.log(pipes);
        // this.pipes.forEach(pipe => {
        //     pipe.count = pipes.find(pipeData => pipeData.key === pipe.key).count;
        // })
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
        this.http.post(this.postUrl, this.form.value).subscribe((response) => {
            this.tostr.success('Pipe Information added successfully', null, { timeOut: 2000 });
            this.dialogRef.close(response);
        }, (err) => {
            if (err) {
                this.tostr.error('Error while saving Pipe Information', null, { timeOut: 1500 });
            }
        })
    }

    godownChange(event: MatSelectChange) {
        this.loader.showSaveLoader('Loading ...');
        const pipeUrl = this.getPipeUrl + '/' + event.value.godown_id;
        this.http.get(pipeUrl).subscribe((pipes: any[]) => {
            this.pipes.forEach(pipe => {
                this.loader.hideSaveLoader();
                pipe.count = pipes[pipe.key] ? pipes[pipe.key] : 0;
                const ctrl = this.form.get(pipe.groupName);
                if (ctrl) {
                    ctrl.get('start').setValue(pipe.count);
                    this.caclPipeAdded(ctrl as FormGroup, pipe.groupName);
                }
            })
        })
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
        // console.log(start)
        return this.fb.group({ count: '', start, end: start })
    }
}