import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Godown } from '../pipe/Godown';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { listStateTrigger } from '../../animations';
import { Bit } from './Bit';
import { MatDialog, MatSelectChange } from '@angular/material';
import { AddBitDialogComponent } from './add-bit-dialog/add-bit-dialog.component';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { BitBill } from './add-bit-dialog/LastBitBill';
import { LoaderService } from '../../services/loader-service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../services/app.service';
import { finalize } from 'rxjs/operators';

const BIT_LENGTH = 20;

@Component({
    templateUrl: './bits.component.html',
    styleUrls: ['./bits.component.scss'],
    animations: [listStateTrigger]
})
export class BitsComponent {
    appearance;
    selectedGodown: Godown;
    godowns: Godown[];
    godownSelectDisabled;
    loading;
    routeDataSubscription: Subscription;
    bits: Bit[];
    lastBillUrl;
    bitUrl;
    constructor(
        private config: ConfigService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private loader: LoaderService,
        private http: HttpClient,
        private toastr: ToastrService,
        private auth: AuthService,
        private app: AppService
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.lastBillUrl = this.config.getAbsoluteUrl('LastBitBill');
        this.bitUrl = this.config.getAbsoluteUrl('BitList');
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.godowns = data.bitData.godowns;
            this.selectedGodown = this.godowns[1];

            setTimeout(() => {
                // this.items = [1, 2, 3, 4, 5, 6, 7, 8]
                this.updateBits(data.bitData.bits);
            })
        })
    }

    updateBits(bits) {
        this.bits = bits;

        this.bits.forEach(bit => {
            bit['length'] = bit.count ? (+bit.count * BIT_LENGTH).toString() : '0';
        });
    }

    navigateToViewBill() {

    }

    godownChange($event: MatSelectChange) {
        this.loading = true;
        this.godownSelectDisabled = true;
        this.app.selectedGodownId = $event.value.godown_id;
        const params = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', $event.value.godown_id)
        this.http.get(this.bitUrl, { params }).pipe(finalize(() => {
            this.loading = false;
            this.godownSelectDisabled = false;
        })).subscribe(bits => {
            this.updateBits(bits);
        }, (err) => {
            if (err) {
                this.toastr.error('Error while Fetching Pipe Information', null, { timeOut: 2000 })
            }
        });
    }

    openAddBit() {

        const params = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', this.selectedGodown.godown_id);
        let lastSerialNo: BitBill[];
        this.loader.showSaveLoader('Loading ...');
        this.http.get<BitBill[]>(this.lastBillUrl, { params }).subscribe(lastBill => {
            const dialogRef = this.dialog.open(AddBitDialogComponent, {
                width: '60vw',
                position: { top: '0px' },
                maxHeight: '100vh',
                height: '100vh',
                data: {
                    selectedGodown: this.selectedGodown,
                    lastBill
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe((bits) => {
                if (bits) {
                    this.updateBits(bits);
                    // this.selectedGodownId = this.app.selectedGodownId
                }
            });
            this.loader.hideSaveLoader();
        }, (err) => {
            this.loader.hideSaveLoader();
            if (err) {
                this.toastr.error('Unable to fetch Last Bill Data', null, { timeOut: 2000 })
            }
        })
    }
}