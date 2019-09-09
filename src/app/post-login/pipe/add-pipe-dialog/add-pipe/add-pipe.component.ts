import { Component, Input, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSelect, MatInput, MatSelectChange } from '@angular/material';
import { ConfigService } from '../../../../services/config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader-service';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'add-pipe',
    templateUrl: './add-pipe.component.html',
    styleUrls: ['./add-pipe.component.scss']
})
export class AddPipeComponent {
    @Input() godownTypes;
    @Input() pipes;
    @Input() form: FormGroup;
    
    appearance;
    
    checkUniqueBillNoUrl;
    billNoValidationPending;
    previousBillNo = '';
    _inputElems: QueryList<ElementRef | MatSelect | MatInput>
    @ViewChildren('inputFocus') set inputElems(elems: QueryList<ElementRef | MatSelect | MatInput>) {
        setTimeout(() => {
            this._inputElems = elems;
        }, 100);
    }
    getPipeUrl;
    constructor(
        private config: ConfigService,
        private fb: FormBuilder,
        private http: HttpClient,
        private tostr: ToastrService,
        private loader: LoaderService,
        private auth: AuthService
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.getPipeUrl = this.config.getAbsoluteUrl('pipeCount') + '/' + this.auth.userid;
        this.checkUniqueBillNoUrl = this.config.getAbsoluteUrl('billNoExists');
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const godownTypeSelect = this._inputElems.toArray()[0] as MatSelect;
            if (godownTypeSelect) {
                godownTypeSelect.open();
            }
        }, 500)

    }

    onBillNoChange() {
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

    onBillEnter() {
        // either enter key up or change will be called, both are not called same time
        this.onBillNoChange();
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