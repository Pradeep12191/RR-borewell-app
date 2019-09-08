import { Component, Inject, ViewChildren, QueryList, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, FormGroup, FormControl, NgControl, FormControlName, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelect, MatSelectChange, MatInput } from '@angular/material';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader-service';

@Component({
    templateUrl: './add-pipe-dialog.component.html',
    styleUrls: ['./add-pipe-dialog.component.scss']
})
export class AddPipeDialogComponent implements AfterViewInit {
    appearance;
    godownTypes = [];
    form: FormGroup;
    selectedGodown;
    checkUniqueBillNoUrl;
    billNoValidationPending;
    _inputElems: QueryList<ElementRef | MatSelect | MatInput>
    @ViewChildren('inputFocus') set inputElems(elems: QueryList<ElementRef | MatSelect | MatInput>) {
        setTimeout(() => {
            this._inputElems = elems;
        }, 100);
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
        this.checkUniqueBillNoUrl = this.config.getAbsoluteUrl('billNoExists');
        // this.selectedGodown = this.godownTypes.find(godown => godown.godown_id === data.selectedGodownId);
        const pipes = data.pipes;
        // console.log(pipes);
        // this.pipes.forEach(pipe => {
        //     pipe.count = pipes.find(pipeData => pipeData.key === pipe.key).count;
        // })
        this.form = this.fb.group({
            billNo: ['', Validators.required],
            godownType: '',
            remarks: ''
        })
        this.pipes.forEach(pipe => {
            this.form.addControl(pipe.groupName, this.buildPipeForm(pipe.count))
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const godownTypeSelect = this._inputElems.toArray()[0] as MatSelect;
            if (godownTypeSelect) {
                godownTypeSelect.open();
            }
        }, 300)

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

    // onBillNoChange() {
    //     console.log('changes')
    // }

    onBillNoChange(event: KeyboardEvent) {

        const billNoCtrl = this.form.get('billNo');
        const godownTypeCtrl = this.form.get('godownType');
        // return console.log(billNoCtrl.value)
        if (godownTypeCtrl.value) {
            const url = this.checkUniqueBillNoUrl + '/' + this.auth.userid + '/' + godownTypeCtrl.value.godown_id + '/' + billNoCtrl.value;
            if (billNoCtrl.hasError('required')) {
                billNoCtrl.markAllAsTouched();
                return;
            } else {
                billNoCtrl.disable();
                this.billNoValidationPending = true;
                this.http.get(url).subscribe(() => {
                    let nextCtrl = this._inputElems.toArray()[2];
                    if (nextCtrl) {
                        ((nextCtrl as ElementRef).nativeElement as HTMLInputElement).focus()
                    };
                    billNoCtrl.enable();
                    this.billNoValidationPending = false;
                }, (err: HttpErrorResponse) => {
                    if (err) {
                        if (err.status === 409) {
                            billNoCtrl.markAllAsTouched();
                            billNoCtrl.enable();
                            this.billNoValidationPending = false;
                            billNoCtrl.setErrors({ notUnique: true });
                            (this._inputElems.toArray()[1] as MatInput).focus();
                        } else {
                            this.tostr.error('Cannot check Bill no at this moment', null, {
                                timeOut: 2000
                            });
                            billNoCtrl.enable();
                            this.billNoValidationPending = false;
                        }
                    }

                })
            }
        } else {
            billNoCtrl.markAsTouched();
            (event.target as HTMLInputElement).value = '';
            this.tostr.error('Please Select Gododown Type', null, { timeOut: 1500 });
            setTimeout(() => {
                const godownTypeSelect = this._inputElems.toArray()[0] as MatSelect;
                if (godownTypeSelect) {
                    godownTypeSelect.focus();
                    godownTypeSelect.open();
                }
            }, 300)
        }

    }

    onEnter(event: KeyboardEvent, currentIndex) {
        const nextCtrl = this._inputElems.toArray()[currentIndex + 1];
        if (nextCtrl) {
            if (nextCtrl instanceof MatInput) {
                return nextCtrl.focus();
            }
            if (nextCtrl instanceof ElementRef) {
                (nextCtrl.nativeElement as HTMLInputElement).focus();
            }
        }
    }

    godownChange(event: MatSelectChange) {
        this.loader.showSaveLoader('Loading ...');
        const pipeUrl = this.getPipeUrl + '/' + event.value.godown_id;
        this.http.get(pipeUrl).subscribe((pipes: any[]) => {
            this.loader.hideSaveLoader();
            this.pipes.forEach(pipe => {
                pipe.count = pipes[pipe.key] ? pipes[pipe.key] : 0;
                const ctrl = this.form.get(pipe.groupName);
                if (ctrl) {
                    ctrl.get('start').setValue(pipe.count);
                    this.caclPipeAdded(ctrl as FormGroup, pipe.groupName);
                }
            });
            (this._inputElems.toArray()[1] as MatInput).focus();
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