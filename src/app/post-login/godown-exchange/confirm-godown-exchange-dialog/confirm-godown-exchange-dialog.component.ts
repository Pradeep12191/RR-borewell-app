import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PipeSize } from '../../../models/PipeSize';
import { Godown } from '../../pipe/Godown';
import { AuthService } from '../../../services/auth.service';
import { Moment } from 'moment';
import { ConfigService } from '../../../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';


@Component({
    templateUrl: './confirm-godown-exchange-dialog.component.html',
    styleUrls: ['./confirm-godown-exchange-dialog.component.scss']
})
export class ConfirmGodownExchangeComponent {
    pipe: PipeSize;
    fromGodown: Godown;
    toGodown: Godown;
    date;
    pipes;
    updateUrl;
    constructor(
        @Inject(MAT_DIALOG_DATA) data,
        private dialogRef: MatDialogRef<ConfirmGodownExchangeComponent>,
        private auth: AuthService,
        private config: ConfigService,
        private toastr: ToastrService,
        private http: HttpClient
    ) {
        this.pipe = data.pipe;
        this.fromGodown = data.fromGodown;
        this.toGodown = data.toGodown;
        this.date = data.date;
        this.pipes = data.pipes;
        this.updateUrl = this.config.getAbsoluteUrl('godownExchange');
    }

    savePipe() {
        const payload = this.pipes.map(pipe => {
            const data = {}
            data['user_id'] = this.auth.userid;
            data['from_gudown_type'] = this.fromGodown.godownType;
            data['from_gudown_id'] = this.fromGodown.godown_id;
            data['to_gudown_type'] = this.toGodown.godownType;
            data['to_gudown_id'] = this.toGodown.godown_id;
            data['serial_no'] = pipe.serial_no;
            data['serial_no_id'] = pipe.serial_no;
            data['pipe_size'] = this.pipe.size;
            data['pipe_type'] = this.pipe.type;
            data['bill_no'] = pipe.billno;
            data['date'] = this.date ? (this.date as Moment).format('DD-MM-YYYY') : '';
            data['remarks'] = '';
            return data;
        });
        console.log(JSON.stringify({ assignedPipes: payload }, null, 2));
        this.http.put(this.updateUrl, { assignedPipes: payload }).subscribe((response) => {
            this.toastr.success(`Pipes exchanged from - ${this.fromGodown.godownType.toUpperCase()} to ${this.toGodown.godownType.toUpperCase()} successfully`, null, { timeOut: 2000 });
            this.dialogRef.close(response)
        }, (err) => {
            if (err) {
                this.toastr.error(`Network Error while exchanging godown`, null, { timeOut: 2000 })
            }
        })
    }
}